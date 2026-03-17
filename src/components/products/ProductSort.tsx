import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'

interface ProductSortProps {
    currentSort: SortOption
    onSortChange: (sort: SortOption) => void
}

export default function ProductSort({ currentSort, onSortChange }: ProductSortProps) {
    const { t } = useTranslation()

    const sortOptions: { value: SortOption; label: string }[] = [
        { value: 'price_asc', label: t('sort.priceAsc', 'Price: Low to High') },
        { value: 'price_desc', label: t('sort.priceDesc', 'Price: High to Low') },
        { value: 'name_asc', label: t('sort.nameAsc', 'Name: A-Z') },
    ]

    const currentLabel = sortOptions.find(o => o.value === currentSort)?.label

    return (
        <div className="relative z-30 flex items-center">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="group inline-flex justify-between items-center w-full md:w-56 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 transition-all">
                        <span className="flex items-center gap-2">
                            <ArrowsUpDownIcon className="w-4 h-4 text-gold-500" />
                            <span className="truncate">{currentLabel}</span>
                        </span>
                        <ChevronDownIcon
                            className="ml-2 -mr-1 h-4 w-4 text-gray-500 group-hover:text-gold-400 transition-colors"
                            aria-hidden="true"
                        />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-700/50 rounded-xl bg-gray-800 shadow-xl border border-gray-700 focus:outline-none z-50 overflow-hidden ring-1 ring-black/5">
                        <div className="px-1 py-1">
                            {sortOptions.map((option) => (
                                <Menu.Item key={option.value}>
                                    {({ active }) => (
                                        <button
                                            onClick={() => onSortChange(option.value)}
                                            className={`${active ? 'bg-gold-500 text-white' : 'text-gray-300'
                                                } ${currentSort === option.value ? 'bg-gold-500/10 text-gold-400 font-semibold' : ''
                                                } group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}
                                        >
                                            {option.label}
                                        </button>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}
