import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  EnvelopeIcon,
  MapPinIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { useStoreSettingsStore } from '../../store/storeSettingsStore'
import { useCookieConsentStore } from '../../store/cookieConsentStore'
import { getImageUrl } from '../../utils/imageUrl'

// Social Media Icons
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468.465c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
)

export default function Footer() {
  const { t } = useTranslation()
  const { settings, fetchSettings } = useStoreSettingsStore()
  const { showPreferencesModal } = useCookieConsentStore()
  const [isLoaded, setIsLoaded] = useState(false)

  // Defer settings fetch to avoid blocking FCP
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSettings()
      setIsLoaded(true)
    }, 500) // Longer delay since footer is below fold

    return () => clearTimeout(timer)
  }, [fetchSettings])

  const quickLinks = [
    { name: t('navigation.products'), href: '/products' },
    { name: t('navigation.categories'), href: '/categories' },
    { name: t('products.newArrivals'), href: '/new' },
    { name: t('products.onSale'), href: '/sale' },
    { name: t('footer.giftCards'), href: '/gift-cards' }
  ]

  const companyLinks = [
    { name: t('footer.aboutUs'), href: '/about' },
    { name: t('partnerships.hero.title'), href: '/partnerships' },
    { name: t('footer.careers'), href: '/careers' }, // Assuming these routes might exist or will be added
    { name: t('footer.sustainability'), href: '/sustainability' },
    { name: t('footer.press'), href: '/press' }
  ]

  const supportLinks = [
    { name: t('navigation.contact'), href: '/contact' },
    { name: t('footer.shipping'), href: '/shipping' },
    { name: t('footer.returns'), href: '/returns' },
    { name: t('footer.sizeGuide'), href: '/size-guide' },
    { name: t('footer.faq'), href: '/faq' }
  ]

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-900 font-sans">

      {/* Newsletter Section */}
      <div className="border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold text-white font-playfair mb-2">
                {t('footer.joinInnerCircle')}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t('footer.subscribePromise')}
              </p>
            </div>
            <div className="w-full max-w-md">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder={t('footer.enterEmailAddress')}
                  className="flex-1 bg-gray-900/50 border border-gray-800 text-white px-4 py-3 rounded-none focus:outline-none focus:border-gold-500 transition-colors placeholder:text-gray-600"
                  aria-label={t('auth.email')}
                />
                <button
                  type="submit"
                  className="bg-white text-gray-950 px-8 py-3 font-bold uppercase tracking-wider text-xs hover:bg-gold-400 transition-colors flex items-center justify-center gap-2"
                >
                  {t('footer.subscribe')}
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-block group">
              <div className="flex items-center gap-3">
                {isLoaded && settings.store_logo_url ? (
                  <img
                    src={getImageUrl(settings.store_logo_url)}
                    alt={settings.store_name || 'Store Logo'}
                    className="h-10 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <span className="text-2xl font-black font-playfair text-white tracking-tighter uppercase">
                    {settings?.store_name || 'SETUPDREAM'}
                  </span>
                )}
              </div>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              {t('footer.brandDescription')}
            </p>
            <div className="flex gap-6">
              {/* Social Icons */}
              {isLoaded && settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label={t('footer.followFacebook')}>
                  <FacebookIcon className="h-5 w-5" />
                </a>
              )}
              {isLoaded && settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label={t('footer.followInstagram')}>
                  <InstagramIcon className="h-5 w-5" />
                </a>
              )}
              {isLoaded && settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label={t('footer.followTwitter')}>
                  <TwitterIcon className="h-5 w-5" />
                </a>
              )}
            </div>

            {isLoaded && (
              <div className="space-y-3 pt-4 border-t border-gray-900/50">
                <div className="flex items-center gap-3 text-sm group">
                  <EnvelopeIcon className="w-4 h-4 text-gray-600 group-hover:text-gold-500 transition-colors" />
                  <a href={`mailto:${settings.store_email}`} className="hover:text-white transition-colors">{settings.store_email}</a>
                </div>
                <div className="flex items-center gap-3 text-sm group">
                  <MapPinIcon className="w-4 h-4 text-gray-600 group-hover:text-gold-500 transition-colors" />
                  <span className="hover:text-white transition-colors">{settings.store_address}</span>
                </div>
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">

            {/* Shop Column */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">{t('footer.shop')}</h4>
              <ul className="space-y-4 text-sm">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="hover:text-gold-400 transition-colors block py-0.5">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">{t('footer.company')}</h4>
              <ul className="space-y-4 text-sm">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="hover:text-gold-400 transition-colors block py-0.5">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">{t('footer.support')}</h4>
              <ul className="space-y-4 text-sm">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="hover:text-gold-400 transition-colors block py-0.5">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-900 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">
              {t('footer.copyright', {
                year: new Date().getFullYear(),
                storeName: isLoaded ? settings.store_name : 'SetupDream'
              })}
            </p>

            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs text-gray-500 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link>
              <Link to="/terms" className="hover:text-white transition-colors">{t('footer.termsOfService')}</Link>
              <Link to="/cookie-policy" className="hover:text-white transition-colors">{t('footer.cookiePolicy')}</Link>
              <button onClick={showPreferencesModal} className="hover:text-white transition-colors cursor-pointer text-left">Cookie Settings</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
