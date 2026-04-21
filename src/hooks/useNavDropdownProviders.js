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
  const togel = useProviderCategory('togel')
  const fishing = useProviderCategory('fishing')
  const arcade = useProviderCategory('arcade')
  const crush = useProviderCategory('crush')
  const esports = useProviderCategory('esports')
  const poker = useProviderCategory('poker')
  const sabung = useProviderCategory('sabung')

  const providersByCategory = useMemo(
    () => ({
      slots: slots.providers,
      sports: sports.providers,
      casino: casino.providers,
      togel: togel.providers,
      fishing: fishing.providers,
      arcade: arcade.providers,
      crush: crush.providers,
      esports: esports.providers,
      poker: poker.providers,
      sabung: sabung.providers,
    }),
    [
      slots.providers,
      sports.providers,
      casino.providers,
      togel.providers,
      fishing.providers,
      arcade.providers,
      crush.providers,
      esports.providers,
      poker.providers,
      sabung.providers,
    ],
  )

  /** Sama seperti sebelumnya: nav dianggap siap setelah batch prioritas (slots + togel) selesai */
  const loading = slots.loading || togel.loading

  return { providersByCategory, loading }
}
