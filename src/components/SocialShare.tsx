import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    ShareIcon,
    LinkIcon,
    CheckIcon
} from '@heroicons/react/24/outline'

// Simple icons for social media
const FacebookIcon = ({ className }: { className?: string }) => (
    <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
    <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
    </svg>
)

const WhatsappIcon = ({ className }: { className?: string }) => (
    <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
)

interface SocialShareProps {
    title: string
    text?: string
    url?: string
    className?: string
}

export default function SocialShare({
    title,
    text = '',
    url = typeof window !== 'undefined' ? window.location.href : '',
    className = ''
}: SocialShareProps) {
    const { t } = useTranslation()
    const [copied, setCopied] = useState(false)

    const encodedUrl = encodeURIComponent(url)
    const encodedText = encodeURIComponent(text ? `${text}\n\n` : '')
    const encodedTitle = encodeURIComponent(title)

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: WhatsappIcon,
            href: `https://wa.me/?text=${encodedText}${encodedTitle}%20${encodedUrl}`,
            color: 'hover:text-green-500'
        },
        {
            name: 'Facebook',
            icon: FacebookIcon,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'hover:text-blue-600'
        },
        {
            name: 'Twitter', // X
            icon: TwitterIcon,
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: 'hover:text-black dark:hover:text-white'
        },
        {
            name: 'LinkedIn',
            icon: LinkedinIcon,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: 'hover:text-blue-700'
        }
    ]

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: text || title,
                    url
                })
            } catch (err) {
                console.log('Error sharing:', err)
            }
        }
    }

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('common.share', 'Share')}:</span>

            <div className="flex items-center gap-2">
                {/* Mobile: Native Share Button */}
                <button
                    onClick={handleNativeShare}
                    className="md:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gold-500 hover:text-white transition-all"
                    aria-label="Share"
                >
                    <ShareIcon className="w-5 h-5" />
                </button>

                {/* Desktop: Social Icons */}
                <div className="hidden md:flex items-center gap-2">
                    {shareLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all ${link.color} hover:bg-white dark:hover:bg-gray-700 shadow-sm`}
                            aria-label={`Share on ${link.name}`}
                        >
                            <link.icon className="w-5 h-5" />
                        </a>
                    ))}
                </div>

                {/* Copy Link - Always Visible */}
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gold-500 hover:text-white transition-all shadow-sm relative group"
                    aria-label="Copy Link"
                >
                    {copied ? (
                        <CheckIcon className="w-5 h-5 text-green-500 group-hover:text-white" />
                    ) : (
                        <LinkIcon className="w-5 h-5" />
                    )}

                    {/* Tooltip */}
                    {copied && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                            Copied!
                        </span>
                    )}
                </button>
            </div>
        </div>
    )
}
