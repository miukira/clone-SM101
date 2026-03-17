import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  login, 
  register, 
  checkUsername, 
  checkPhoneNumber, 
  checkBankNumber,
  setToken,
  getBankList
} from '../services/api'

// Icons
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
)

export default function AuthModal({ isOpen, onClose, initialTab = 'login', onLoginSuccess }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Bank list for register
  const [bankOptions] = useState([
    { value: 'bca', label: 'BCA' },
    { value: 'mandiri', label: 'MANDIRI' },
    { value: 'bni', label: 'BNI' },
    { value: 'bri', label: 'BRI' },
    { value: 'cimb', label: 'CIMB NIAGA' },
    { value: 'danamon', label: 'DANAMON' },
    { value: 'permata', label: 'PERMATA' },
    { value: 'gopay', label: 'GOPAY' },
    { value: 'dana', label: 'DANA' },
    { value: 'ovo', label: 'OVO' },
    { value: 'linkaja', label: 'LINKAJA' },
  ])
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  })
  
  // Register form state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    handphone: '',
    bank_name: '',
    bank_account: '',
    bank_number: '',
    referral: ''
  })
  
  // Validation state
  const [validation, setValidation] = useState({
    usernameAvailable: null,
    phoneAvailable: null,
    bankAvailable: null,
    checking: false
  })

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    if (isOpen) {
      setError('')
      setSuccess('')
    }
  }, [isOpen, activeTab])

  // Check username availability (debounced)
  useEffect(() => {
    if (registerForm.username.length >= 4) {
      const timer = setTimeout(async () => {
        setValidation(v => ({ ...v, checking: true }))
        try {
          const result = await checkUsername(registerForm.username)
          setValidation(v => ({ ...v, usernameAvailable: result.available, checking: false }))
        } catch {
          setValidation(v => ({ ...v, checking: false }))
        }
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setValidation(v => ({ ...v, usernameAvailable: null }))
    }
  }, [registerForm.username])

  // Check phone availability (debounced)
  useEffect(() => {
    if (registerForm.handphone.length >= 10) {
      const timer = setTimeout(async () => {
        try {
          const result = await checkPhoneNumber(registerForm.handphone)
          setValidation(v => ({ ...v, phoneAvailable: result.available }))
        } catch {
          // ignore
        }
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setValidation(v => ({ ...v, phoneAvailable: null }))
    }
  }, [registerForm.handphone])

  // Check bank number availability (debounced)
  useEffect(() => {
    if (registerForm.bank_number.length >= 10) {
      const timer = setTimeout(async () => {
        try {
          const result = await checkBankNumber(registerForm.bank_number)
          setValidation(v => ({ ...v, bankAvailable: result.available }))
        } catch {
          // ignore
        }
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setValidation(v => ({ ...v, bankAvailable: null }))
    }
  }, [registerForm.bank_number])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const result = await login(loginForm.username, loginForm.password)
      setToken(result.token)
      setSuccess('Login berhasil!')
      
      // Callback and redirect
      if (onLoginSuccess) {
        onLoginSuccess(result)
      }
      
      setTimeout(() => {
        onClose()
        navigate('/member')
      }, 1000)
    } catch (err) {
      setError(err.data?.message || 'Login gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama')
      return
    }
    
    if (registerForm.password.length < 3) {
      setError('Password minimal 3 karakter')
      return
    }
    
    if (!registerForm.bank_name) {
      setError('Silakan pilih bank')
      return
    }
    
    if (validation.usernameAvailable === false) {
      setError('Username sudah digunakan')
      return
    }
    
    if (validation.phoneAvailable === false) {
      setError('Nomor HP sudah terdaftar')
      return
    }
    
    if (validation.bankAvailable === false) {
      setError('Nomor rekening sudah terdaftar')
      return
    }
    
    setLoading(true)
    
    try {
      const result = await register({
        username: registerForm.username,
        password: registerForm.password,
        handphone: registerForm.handphone,
        bank_name: registerForm.bank_name,
        bank_account: registerForm.bank_account,
        bank_number: registerForm.bank_number,
        referral: registerForm.referral || undefined
      })
      
      setToken(result.token)
      setSuccess('Registrasi berhasil!')
      
      if (onLoginSuccess) {
        onLoginSuccess(result)
      }
      
      setTimeout(() => {
        onClose()
        navigate('/member')
      }, 1000)
    } catch (err) {
      setError(err.data?.message || 'Registrasi gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-[#333] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-[#333]">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('login')}
              className={`px-6 py-2 text-sm font-bold tracking-wider transition-all rounded-lg ${
                activeTab === 'login'
                  ? 'bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] text-black shadow-lg'
                  : 'text-[#808080] hover:text-white'
              }`}
            >
              MASUK
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-6 py-2 text-sm font-bold tracking-wider transition-all rounded-lg ${
                activeTab === 'register'
                  ? 'bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] text-black shadow-lg'
                  : 'text-[#808080] hover:text-white'
              }`}
            >
              DAFTAR
            </button>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#808080] hover:text-white transition-colors"
          >
            <CloseIcon />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}
          
          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-[#808080] mb-2 tracking-wider">USERNAME</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-[#505050] focus:border-[#C0C0C0] focus:outline-none transition-colors"
                  placeholder="Masukkan username"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs text-[#808080] mb-2 tracking-wider">PASSWORD</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-[#505050] focus:border-[#C0C0C0] focus:outline-none transition-colors pr-12"
                    placeholder="Masukkan password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#808080] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-xl text-black font-bold tracking-wider hover:from-white hover:to-[#B0B0B0] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <LoadingSpinner /> : 'MASUK'}
              </button>
              
              <p className="text-center text-xs text-[#606060]">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-[#C0C0C0] hover:text-white transition-colors"
                >
                  Daftar sekarang
                </button>
              </p>
              
              {/* Demo account hint */}
              <div className="mt-4 p-3 bg-[#1a1a1a] border border-[#333] rounded-lg">
                <p className="text-xs text-[#606060] text-center">
                  Demo: username <span className="text-[#C0C0C0]">user1</span> / password <span className="text-[#C0C0C0]">123</span>
                </p>
              </div>
            </form>
          )}
          
          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs text-[#808080] mb-2 tracking-wider">USERNAME</label>
                <div className="relative">
                  <input
                    type="text"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                    className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-[#505050] focus:outline-none transition-colors pr-10 ${
                      validation.usernameAvailable === true ? 'border-green-500' :
                      validation.usernameAvailable === false ? 'border-red-500' :
                      'border-[#333] focus:border-[#C0C0C0]'
                    }`}
                    placeholder="Min. 4 karakter (huruf & angka)"
                    minLength={4}
                    required
                  />
                  {validation.usernameAvailable !== null && (
                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg ${
                      validation.usernameAvailable ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {validation.usernameAvailable ? '✓' : '✗'}
                    </span>
                  )}
                </div>
                {validation.usernameAvailable === false && (
                  <p className="text-xs text-red-400 mt-1">Username sudah digunakan</p>
                )}
              </div>
              
              {/* Password */}
              <div>
                <label className="block text-xs text-[#808080] mb-2 tracking-wider">PASSWORD</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-[#505050] focus:border-[#C0C0C0] focus:outline-none transition-colors pr-12"
                    placeholder="Min. 3 karakter"
                    minLength={3}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#808080] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              
              {/* Confirm Password */}
              <div>
                <label className="block text-xs text-[#808080] mb-2 tracking-wider">KONFIRMASI PASSWORD</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-[#505050] focus:outline-none transition-colors pr-12 ${
                      registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword
                        ? 'border-red-500'
                        : 'border-[#333] focus:border-[#C0C0C0]'
                    }`}
                    placeholder="Ulangi password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#808080] hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              
              {/* Phone */}
              <div>
                <label className="block text-xs text-[#808080] mb-2 tracking-wider">NOMOR HP</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={registerForm.handphone}
                    onChange={(e) => setRegisterForm({ ...registerForm, handphone: e.target.value.replace(/[^0-9]/g, '') })}
                    className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-[#505050] focus:outline-none transition-colors pr-10 ${
                      validation.phoneAvailable === true ? 'border-green-500' :
                      validation.phoneAvailable === false ? 'border-red-500' :
                      'border-[#333] focus:border-[#C0C0C0]'
                    }`}
                    placeholder="Contoh: 081234567890"
                    minLength={10}
                    required
                  />
                  {validation.phoneAvailable !== null && (
                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg ${
                      validation.phoneAvailable ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {validation.phoneAvailable ? '✓' : '✗'}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Bank Selection */}
              <div>
                <label className="block text-xs text-[#808080] mb-2 tracking-wider">NAMA BANK</label>
                <select
                  value={registerForm.bank_name}
                  onChange={(e) => setRegisterForm({ ...registerForm, bank_name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white focus:border-[#C0C0C0] focus:outline-none transition-colors"
                  required
                >
                  <option value="">Pilih Bank / E-Wallet</option>
                  {bankOptions.map(bank => (
                    <option key={bank.value} value={bank.value}>{bank.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Bank Account Name */}
              <div>
                <label className="block text-xs text-[#808080] mb-2 tracking-wider">NAMA REKENING</label>
                <input
                  type="text"
                  value={registerForm.bank_account}
                  onChange={(e) => setRegisterForm({ ...registerForm, bank_account: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-[#505050] focus:border-[#C0C0C0] focus:outline-none transition-colors"
                  placeholder="Nama sesuai rekening bank"
                  required
                />
              </div>
              
              {/* Bank Number */}
              <div>
                <label className="block text-xs text-[#808080] mb-2 tracking-wider">NOMOR REKENING</label>
                <div className="relative">
                  <input
                    type="text"
                    value={registerForm.bank_number}
                    onChange={(e) => setRegisterForm({ ...registerForm, bank_number: e.target.value.replace(/[^0-9]/g, '') })}
                    className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-[#505050] focus:outline-none transition-colors pr-10 ${
                      validation.bankAvailable === true ? 'border-green-500' :
                      validation.bankAvailable === false ? 'border-red-500' :
                      'border-[#333] focus:border-[#C0C0C0]'
                    }`}
                    placeholder="Nomor rekening bank / e-wallet"
                    minLength={10}
                    required
                  />
                  {validation.bankAvailable !== null && (
                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg ${
                      validation.bankAvailable ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {validation.bankAvailable ? '✓' : '✗'}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Referral Code (Optional) */}
              <div>
                <label className="block text-xs text-[#808080] mb-2 tracking-wider">KODE REFERRAL (OPSIONAL)</label>
                <input
                  type="text"
                  value={registerForm.referral}
                  onChange={(e) => setRegisterForm({ ...registerForm, referral: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-[#505050] focus:border-[#C0C0C0] focus:outline-none transition-colors"
                  placeholder="Masukkan kode referral jika ada"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || validation.usernameAvailable === false || validation.phoneAvailable === false || validation.bankAvailable === false}
                className="w-full py-3 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-xl text-black font-bold tracking-wider hover:from-white hover:to-[#B0B0B0] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <LoadingSpinner /> : 'DAFTAR'}
              </button>
              
              <p className="text-center text-xs text-[#606060]">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-[#C0C0C0] hover:text-white transition-colors"
                >
                  Masuk disini
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
