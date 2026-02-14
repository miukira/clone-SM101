import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FaChevronLeft, FaEye, FaEyeSlash, FaSyncAlt } from 'react-icons/fa'
import logo from '../assets/images/logo.png'
import Footer from '../components/Footer'

const bankOptions = [
  'BCA', 'BRI', 'MANDIRI', 'CIMB', 'BSI', 'DANAMON', 'BNI', 'DANA',
  'OVO', 'GOPAY', 'LINKAJA', 'JAGO', 'SEABANK'
]

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    email: '',
    bank: '',
    accountName: '',
    accountNumber: '',
    referral: '',
    captcha: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha())

  function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    let result = ''
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha())
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleBankSelect = (bank) => {
    setFormData({
      ...formData,
      bank: bank
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-[#0d1829] md:rounded-xl overflow-hidden">
      {/* Header - Fixed on all screens */}
      <div className="fixed top-0 left-0 right-0 bg-[#0a1420] z-50">
        <div className="flex items-center justify-between py-3 px-4 md:py-4">
          <Link to="/" className="text-white hover:text-white/80 p-1">
            <FaChevronLeft className="text-xl md:text-2xl" />
          </Link>
          <h1 className="text-white text-lg md:text-xl font-semibold tracking-wide">DAFTAR</h1>
          <Link to="/">
            <img src={logo} alt="PUSATTOGEL" className="h-8 md:h-10 object-contain" />
          </Link>
        </div>
        {/* Cyan Line */}
        <div className="h-0.5 md:h-1 bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500"></div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[52px] md:h-[60px]"></div>

      {/* Form Container */}
      <div className="bg-white">
        <form onSubmit={handleSubmit}>
          
          {/* Username */}
          <div className="px-5 md:px-10 pt-7 md:pt-10">
            <label className="block text-black text-[17px] md:text-lg font-bold mb-2 md:mb-4">
              <span className="text-red-500 mr-1">*</span>Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="6-14 digit atau kombinasi huruf"
              className="w-full bg-transparent border-b border-slate-200 pb-4 md:pb-6 text-slate-800 placeholder-slate-400 focus:outline-none text-[15px] md:text-base"
            />
          </div>

          {/* Password */}
          <div className="px-5 md:px-10 pt-7 md:pt-10">
            <label className="block text-black text-[17px] md:text-lg font-bold mb-2 md:mb-4">
              <span className="text-red-500 mr-1">*</span>Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="6-16 angka atau kombinasi huruf"
                className="w-full bg-transparent border-b border-slate-200 pb-4 md:pb-6 pr-10 text-slate-800 placeholder-slate-400 focus:outline-none text-[15px] md:text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-4 md:bottom-6 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FaEyeSlash className="text-xl md:text-2xl" /> : <FaEye className="text-xl md:text-2xl" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="px-5 md:px-10 pt-7 md:pt-10">
            <label className="block text-black text-[17px] md:text-lg font-bold mb-2 md:mb-4">
              <span className="text-red-500 mr-1">*</span>Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Silakan masukkan kembali password Anda"
                className="w-full bg-transparent border-b border-slate-200 pb-4 md:pb-6 pr-10 text-slate-800 placeholder-slate-400 focus:outline-none text-[15px] md:text-base"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 bottom-4 md:bottom-6 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <FaEyeSlash className="text-xl md:text-2xl" /> : <FaEye className="text-xl md:text-2xl" />}
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div className="px-5 md:px-10 pt-7 md:pt-10">
            <label className="block text-black text-[17px] md:text-lg font-bold mb-2 md:mb-4">
              <span className="text-red-500 mr-1">*</span>Nomor Ponsel
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nomor ponsel"
              className="w-full bg-transparent border-b border-slate-200 pb-4 md:pb-6 text-slate-800 placeholder-slate-400 focus:outline-none text-[15px] md:text-base"
            />
          </div>

          {/* Email */}
          <div className="px-5 md:px-10 pt-7 md:pt-10">
            <label className="block text-black text-[17px] md:text-lg font-bold mb-2 md:mb-4">
              <span className="text-red-500 mr-1">*</span>Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full bg-transparent border-b border-slate-200 pb-4 md:pb-6 text-slate-800 placeholder-slate-400 focus:outline-none text-[15px] md:text-base"
            />
          </div>

          {/* Bank Selection */}
          <div className="px-5 md:px-10 pt-7 md:pt-10">
            <label className="block text-black text-[17px] md:text-lg font-bold mb-3 md:mb-4">
              <span className="text-red-500 mr-1">*</span>Bank
            </label>
            <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap md:gap-3 pb-4 md:pb-6 border-b border-slate-200">
              {bankOptions.map((bank) => (
                <button
                  key={bank}
                  type="button"
                  onClick={() => handleBankSelect(bank)}
                  className={`py-2.5 md:py-3 px-3 md:px-6 rounded text-sm md:text-base font-medium transition-colors ${
                    formData.bank === bank
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {bank}
                </button>
              ))}
            </div>
          </div>

          {/* Account Name */}
          <div className="px-5 md:px-10 pt-7 md:pt-10">
            <label className="block text-black text-[17px] md:text-lg font-bold mb-2 md:mb-4">
              <span className="text-red-500 mr-1">*</span>Nama Rekening
            </label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              placeholder="Nama Rekening"
              className="w-full bg-transparent border-b border-slate-200 pb-4 md:pb-6 text-slate-800 placeholder-slate-400 focus:outline-none text-[15px] md:text-base"
            />
          </div>

          {/* Account Number */}
          <div className="px-5 md:px-10 pt-7 md:pt-10">
            <label className="block text-black text-[17px] md:text-lg font-bold mb-2 md:mb-4">
              <span className="text-red-500 mr-1">*</span>Nomor Rekening
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Nomor Rekening"
              className="w-full bg-transparent border-b border-slate-200 pb-4 md:pb-6 text-slate-800 placeholder-slate-400 focus:outline-none text-[15px] md:text-base"
            />
          </div>

          {/* Referral */}
          <div className="px-5 md:px-10 pt-7 md:pt-10">
            <label className="block text-black text-[17px] md:text-lg font-bold mb-2 md:mb-4">
              Referral
            </label>
            <input
              type="text"
              name="referral"
              value={formData.referral}
              onChange={handleChange}
              placeholder="Referral"
              className="w-full bg-transparent border-b border-slate-200 pb-4 md:pb-6 text-slate-800 placeholder-slate-400 focus:outline-none text-[15px] md:text-base"
            />
          </div>

          {/* Captcha */}
          <div className="px-5 md:px-10 pt-7 md:pt-10 pb-6 md:pb-10">
            <label className="block text-black text-[17px] md:text-lg font-bold mb-2 md:mb-4">
              Kode Verifikasi
            </label>
            <div className="flex items-center justify-between pb-4 md:pb-6 border-b border-slate-200">
              <input
                type="text"
                name="captcha"
                value={formData.captcha}
                onChange={handleChange}
                placeholder="Kode Verifikasi"
                className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-[15px] md:text-base"
              />
              <div className="flex items-center gap-3">
                <div className="text-2xl md:text-3xl font-bold tracking-widest text-slate-600 select-none" style={{ fontFamily: 'serif', fontStyle: 'italic' }}>
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <FaSyncAlt className="text-lg md:text-2xl" />
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>

      {/* Submit Button */}
      <div className="px-5 py-4 bg-white md:px-10 md:pb-6">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-[#e84a5f] hover:bg-[#d63d51] text-white font-semibold py-3.5 md:py-4 rounded-xl text-base md:text-lg transition-colors"
        >
          Submit
        </button>
      </div>

      {/* Footer - Same as HomePage */}
      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  )
}
