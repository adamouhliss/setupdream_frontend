import { motion } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'
import { CheckBadgeIcon } from '@heroicons/react/24/outline'

const testimonials = [
    {
        id: 1,
        name: "Karim B.",
        role: "CrossFit Athlete",
        content: "La qualité du matériel est incroyable. J'ai équipé toute ma salle avec Carré Sport et je ne regrette absolument pas. Le service client est au top !",
        rating: 5,
        location: "Casablanca"
    },
    {
        id: 2,
        name: "Sarah M.",
        role: "Yoga Instructor",
        content: "Les tapis et accessoires de yoga sont d'une qualité supérieure. Mes élèves adorent le confort et l'esthétique. Livraison super rapide à Rabat.",
        rating: 5,
        location: "Rabat"
    },
    {
        id: 3,
        name: "Youssef T.",
        role: "Gym Owner",
        content: "Un partenaire fiable pour les professionnels. Les machines sont robustes et le prix est très compétitif pour cette qualité de finition.",
        rating: 5,
        location: "Marrakech"
    }
]

const Testimonials = () => {
    return (
        <section className="py-24 bg-gray-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-medium text-sm mb-6"
                    >
                        <CheckBadgeIcon className="w-5 h-5" />
                        Plus de 10,000 clients satisfaits
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold font-playfair text-white mb-6">
                        Ils nous font confiance
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-lora">
                        Découvrez pourquoi les sportifs professionnels et amateurs choisissent Carré Sport pour leur équipement.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-gray-800 p-8 rounded-3xl relative shadow-lg hover:shadow-2xl hover:shadow-gold-500/10 hover:-translate-y-2 transition-all duration-300 border border-gray-700/50"
                        >
                            <div className="absolute -top-6 left-8 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-4xl text-gold-500 font-serif">
                                "
                            </div>

                            <div className="flex gap-1 mb-6 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-gold-400' : 'text-gray-600'}`} />
                                ))}
                            </div>

                            <p className="text-gray-300 font-lora text-lg mb-6 leading-relaxed">
                                {testimonial.content}
                            </p>

                            <div className="flex items-center gap-4 border-t border-gray-700/50 pt-6">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-gray-900 font-bold text-lg">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-400">{testimonial.role} • {testimonial.location}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials
