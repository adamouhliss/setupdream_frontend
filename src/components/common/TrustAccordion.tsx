import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface AccordionItemProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    icon?: React.ElementType
}

export default function TrustAccordion({ title, children, defaultOpen = false, icon: Icon }: AccordionItemProps) {
    return (
        <Disclosure defaultOpen={defaultOpen}>
            {({ open }) => (
                <div className="border-b border-gray-800 last:border-0">
                    <Disclosure.Button className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-200 hover:text-gold-400 transition-colors focus:outline-none">
                        <div className="flex items-center gap-3">
                            {Icon && <Icon className="w-5 h-5 text-gray-400" />}
                            <span className="font-montserrat text-base">{title}</span>
                        </div>
                        <ChevronDownIcon
                            className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 transition-transform duration-200`}
                        />
                    </Disclosure.Button>
                    <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Disclosure.Panel className="pb-4 pt-1 text-sm text-gray-400 leading-relaxed font-lora pl-8 pr-4">
                            {children}
                        </Disclosure.Panel>
                    </Transition>
                </div>
            )}
        </Disclosure>
    )
}
