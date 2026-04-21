import { useMemo } from 'react'
import { useProviderCategory } from '../context/ProviderCategoryContexts.jsx'

/**
 * Prefetch daftar provider per kategori untuk dropdown desktop.
 * Data tiap kategori berasal dari Context terpisah (lihat ProviderCategoriesProvider).
 */
export function useNavDropdownProviders() {
  const slots = useProviderCategory('slots')
  const sports = useProviderCategory('sports')
  const casino = useProviderCategory('casino')
  const fishing = useProviderCategory('fishing')

  const providersByCategory = useMemo(
    () => ({
      slots: slots.providers,
      sports: sports.providers,
      casino: casino.providers,
      fishing: fishing.providers,
    }),
    [
      slots.providers,
      sports.providers,
      casino.providers,
      fishing.providers,
    ],
  )

  /** Nav dianggap siap setelah kategori prioritas (slots) selesai. */
  const loading = slots.loading

  return { providersByCategory, loading }
}
