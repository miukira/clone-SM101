/**
 * Validasi body JSON respons terhadap skema OpenAPI 3 (YAML) memakai AJV.
 * Skema operasi di-dereference, dikonversi ke JSON Schema, lalu dikompilasi dengan Ajv.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import SwaggerParser from '@apidevtools/swagger-parser'
import { openapiSchemaToJsonSchema } from '@openapi-contrib/openapi-schema-to-json-schema'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const OPENAPI_YAML_PATH = path.join(__dirname, '../../openapi.yaml')

/** @type {object | null} */
let dereferencedSpec = null

/** @type {Map<string, import('ajv').ValidateFunction>} */
const responseValidatorCache = new Map()

/** @type {import('ajv').ValidateFunction | null} */
let errorSchemaValidator = null

/** @type {Ajv | null} */
let ajvSingleton = null

function getAjv() {
  if (!ajvSingleton) {
    ajvSingleton = new Ajv({
      allErrors: true,
      strict: false,
      validateFormats: false,
    })
    addFormats(ajvSingleton)
  }
  return ajvSingleton
}

/**
 * Memastikan dokumen OpenAPI valid (struktur + referensi).
 * @returns {Promise<void>}
 */
export async function assertOpenApiDocumentValid() {
  await SwaggerParser.validate(OPENAPI_YAML_PATH)
}

/**
 * Spesifikasi OpenAPI yang sudah di-dereference (untuk $ref).
 * @returns {Promise<object>}
 */
export async function loadOpenApiDereferenced() {
  if (!dereferencedSpec) {
    dereferencedSpec = await SwaggerParser.dereference(OPENAPI_YAML_PATH)
  }
  return dereferencedSpec
}

function stripMeta(schema) {
  if (!schema || typeof schema !== 'object') return schema
  const { $schema, example, examples, ...rest } = schema
  return rest
}

/**
 * Ekstrak & konversi skema JSON Schema untuk `application/json` pada respons HTTP.
 * @param {object} spec — hasil dereference
 * @param {string} apiPath — mis. `/login`
 * @param {string} method — `get`, `post`, …
 * @param {number} statusCode
 * @returns {object}
 */
export function getOpenApiResponseJsonSchema(spec, apiPath, method, statusCode) {
  const pathItem = spec.paths?.[apiPath]
  if (!pathItem) {
    throw new Error(`OpenAPI: tidak ada path ${apiPath}`)
  }
  const op = pathItem[String(method).toLowerCase()]
  if (!op) {
    throw new Error(`OpenAPI: tidak ada operasi ${String(method).toUpperCase()} ${apiPath}`)
  }
  const responses = op.responses || {}
  const resp = responses[String(statusCode)] ?? responses.default
  if (!resp) {
    throw new Error(`OpenAPI: tidak ada respons ${statusCode} untuk ${String(method).toUpperCase()} ${apiPath}`)
  }
  const schema = resp.content?.['application/json']?.schema
  if (!schema) {
    throw new Error(
      `OpenAPI: tidak ada application/json schema untuk ${statusCode} ${String(method).toUpperCase()} ${apiPath}`,
    )
  }
  const converted = openapiSchemaToJsonSchema(schema, {
    cloneSchema: true,
    strictMode: false,
  })
  return stripMeta(converted)
}

/**
 * @param {object} spec
 * @param {string} apiPath
 * @param {string} method
 * @param {number} statusCode
 * @returns {import('ajv').ValidateFunction}
 */
export function compileOpenApiResponseValidator(spec, apiPath, method, statusCode) {
  const key = `${String(method).toLowerCase()}:${apiPath}:${statusCode}`
  if (responseValidatorCache.has(key)) {
    return responseValidatorCache.get(key)
  }
  const jsonSchema = getOpenApiResponseJsonSchema(spec, apiPath, method, statusCode)
  const ajv = getAjv()
  const validate = ajv.compile(jsonSchema)
  responseValidatorCache.set(key, validate)
  return validate
}

/**
 * @param {object} spec
 * @param {string} apiPath
 * @param {string} method
 * @param {number} statusCode
 * @param {unknown} body
 */
export function assertResponseMatchesOpenApi(spec, apiPath, method, statusCode, body) {
  const validate = compileOpenApiResponseValidator(spec, apiPath, method, statusCode)
  if (!validate(body)) {
    const text = getAjv().errorsText(validate.errors, { separator: '\n' })
    const err = new Error(
      `AJV respons tidak cocok OpenAPI: ${String(method).toUpperCase()} ${apiPath} ${statusCode}\n${text}`,
    )
    err.ajvErrors = validate.errors
    throw err
  }
}

/**
 * Validasi body error umum (`#/components/schemas/Error`).
 * @param {object} spec — dereferenced
 * @param {unknown} body
 */
export function assertErrorBodyMatchesOpenApi(spec, body) {
  const errSchema = spec.components?.schemas?.Error
  if (!errSchema) {
    throw new Error('OpenAPI: components.schemas.Error tidak ditemukan')
  }
  if (!errorSchemaValidator) {
    const converted = stripMeta(
      openapiSchemaToJsonSchema(errSchema, {
        cloneSchema: true,
        strictMode: false,
      }),
    )
    errorSchemaValidator = getAjv().compile(converted)
  }
  if (!errorSchemaValidator(body)) {
    const text = getAjv().errorsText(errorSchemaValidator.errors, { separator: '\n' })
    throw new Error(`AJV error body tidak cocok Error schema:\n${text}`)
  }
}
