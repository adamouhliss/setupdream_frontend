
import { FaPinterest } from 'react-icons/fa'

interface PinterestSaveButtonProps {
    url: string
    media: string
    description: string
    className?: string
    size?: 'sm' | 'md' | 'lg'
    iconOnly?: boolean
}

const PinterestSaveButton = ({
    url,
    media,
    description,
    className = '',
    size = 'md',
    iconOnly = false
}: PinterestSaveButtonProps) => {

    // Construct Pinterest Save URL
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(description)}`

    const sizeClasses = {
        sm: iconOnly ? 'p-1.5' : 'px-2 py-1 text-xs gap-1',
        md: iconOnly ? 'p-2' : 'px-3 py-1.5 text-sm gap-2',
        lg: iconOnly ? 'p-2.5' : 'px-4 py-2 text-base gap-2'
    }

    return (
        <a
            href={pinterestUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                inline-flex items-center justify-center font-bold rounded-full transition-all duration-300
                bg-slate-900 border border-gold-500/30 text-gold-500 hover:bg-gold-500 hover:text-slate-900
                shadow-lg hover:shadow-gold-500/20 z-20 group
                ${sizeClasses[size]}
                ${className}
            `}
            aria-label="Save to Pinterest"
        >
            <FaPinterest className={`${iconOnly ? 'w-full h-full' : ''} group-hover:scale-110 transition-transform`} />
            {!iconOnly && <span>Save</span>}
        </a>
    )
}

export default PinterestSaveButton
