import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  ShieldCheckIcon,
  ClockIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

export default function ReturnsPage() {
  const { t } = useTranslation()

  const returnSteps = [
    {
      step: 1,
      titleKey: 'returns.steps.contact.title',
      descriptionKey: 'returns.steps.contact.description',
      icon: PhoneIcon
    },
    {
      step: 2,
      titleKey: 'returns.steps.evaluation.title',
      descriptionKey: 'returns.steps.evaluation.description',
      icon: DocumentTextIcon
    },
    {
      step: 3,
      titleKey: 'returns.steps.authorization.title',
      descriptionKey: 'returns.steps.authorization.description',
      icon: CheckCircleIcon
    },
    {
      step: 4,
      titleKey: 'returns.steps.return.title',
      descriptionKey: 'returns.steps.return.description',
      icon: ArrowPathIcon
    }
  ]

  const defectiveExamples = [
    'returns.examples.manufacturing',
    'returns.examples.damaged',
    'returns.examples.malfunction',
    'returns.examples.missing'
  ]

  const nonDefectiveExamples = [
    'returns.nonExamples.change',
    'returns.nonExamples.size',
    'returns.nonExamples.color',
    'returns.nonExamples.normal'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ArrowPathIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair text-gray-100 mb-4">
            {t('returns.title')}
          </h1>
          <p className="text-xl text-gray-300 font-lora max-w-2xl mx-auto">
            {t('returns.subtitle')}
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-red-900/20 border border-red-600/30 rounded-2xl p-6 mb-12"
        >
          <div className="flex items-start gap-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold font-playfair text-red-300 mb-2">
                {t('returns.important.title')}
              </h3>
              <p className="text-red-200 font-lora">
                {t('returns.important.description')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Return Policy Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-700/30 p-8 mb-12"
        >
          <h2 className="text-2xl font-bold font-playfair text-gray-100 mb-6">
            {t('returns.policy.title')}
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <ClockIcon className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold font-montserrat text-gray-100 mb-2">
                  {t('returns.policy.timeframe.title')}
                </h4>
                <p className="text-gray-300 font-lora">
                  {t('returns.policy.timeframe.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <ShieldCheckIcon className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold font-montserrat text-gray-100 mb-2">
                  {t('returns.policy.condition.title')}
                </h4>
                <p className="text-gray-300 font-lora">
                  {t('returns.policy.condition.description')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What Qualifies as Defective */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-green-900/20 border border-green-600/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircleIcon className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-bold font-playfair text-green-300">
                {t('returns.defective.title')}
              </h3>
            </div>
            <ul className="space-y-2">
              {defectiveExamples.map((example, index) => (
                <li key={index} className="flex items-start gap-2 text-green-200 font-lora">
                  <span className="text-green-400 mt-1">•</span>
                  {t(example)}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-red-900/20 border border-red-600/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-bold font-playfair text-red-300">
                {t('returns.notAccepted.title')}
              </h3>
            </div>
            <ul className="space-y-2">
              {nonDefectiveExamples.map((example, index) => (
                <li key={index} className="flex items-start gap-2 text-red-200 font-lora">
                  <span className="text-red-400 mt-1">•</span>
                  {t(example)}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Return Process Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-700/30 p-8 mb-12"
        >
          <h2 className="text-2xl font-bold font-playfair text-gray-100 mb-8 text-center">
            {t('returns.process.title')}
          </h2>
          
          <div className="space-y-6">
            {returnSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-gold-500 text-white rounded-full flex items-center justify-center text-sm font-bold font-montserrat flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold font-montserrat text-gray-100 mb-2">
                        {t(step.titleKey)}
                      </h4>
                      <p className="text-gray-300 font-lora">
                        {t(step.descriptionKey)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gold-900/20 border border-gold-700/30 rounded-2xl p-6 mb-12"
        >
          <h3 className="text-xl font-bold font-playfair text-gold-300 mb-4 text-center">
            {t('returns.contact.title')}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <PhoneIcon className="w-6 h-6 text-gold-400" />
              <div>
                <p className="font-semibold font-montserrat text-gold-300">
                  {t('returns.contact.phone')}
                </p>
                <p className="text-gold-200 font-lora">+212 632-253960</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <EnvelopeIcon className="w-6 h-6 text-gold-400" />
              <div>
                <p className="font-semibold font-montserrat text-gold-300">
                  {t('returns.contact.email')}
                </p>
                <p className="text-gold-200 font-lora">returns@setupdream.ma</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Legal Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center text-gray-400 text-sm font-lora"
        >
          <p>{t('returns.legal.notice')}</p>
          <p className="mt-2">{t('returns.legal.rights')}</p>
        </motion.div>
      </div>
    </div>
  )
} 