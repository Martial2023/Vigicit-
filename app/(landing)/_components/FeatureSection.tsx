'use client'

import { BoxIcon, Settings, Vegan } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const FeatureSection = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut" as const
            }
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8" ref={ref}>
            <motion.div 
                className="mx-auto max-w-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl/tight font-bold sm:text-4xl">Signaler rapidement</h2>
            </motion.div>

            <motion.div 
                className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <motion.div 
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                    variants={itemVariants}
                >
                    <div className='flex items-center justify-center w-full'>
                        <div className="inline-flex items-center justify-center rounded-lg bg-zinc-100 p-3 text-zinc-700 dark:text-zinc-300">
                        <Settings className='size-6 text-primary'/>
                    </div>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-center">Infrastructures défaillantes</h3>

                    <p className="mt-2 text-pretty text-zinc-700 dark:text-zinc-300 text-center">
                        Nids-de-poule, éclairage public en panne, trottoirs endommagés.
                    </p>
                </motion.div>
                <motion.div 
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                    variants={itemVariants}
                >
                    <div className='flex items-center justify-center w-full'>
                        <div className="inline-flex items-center justify-center rounded-lg bg-zinc-100 p-3 text-zinc-700 dark:text-zinc-300">
                        <Vegan className='size-6 text-primary'/>
                    </div>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-center">Pollution & Déchets</h3>

                    <p className="mt-2 text-pretty text-zinc-700 dark:text-zinc-300 text-center">
                        Dépôts sauvages, graffitis, poubelles qui débordent.
                    </p>
                </motion.div>
                <motion.div 
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                    variants={itemVariants}
                >
                    <div className='flex items-center justify-center w-full'>
                        <div className="inline-flex items-center justify-center rounded-lg bg-zinc-100 p-3 text-zinc-700 dark:text-zinc-300">
                        <Settings className='size-6 text-primary'/>
                    </div>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-center">Insécurité</h3>

                    <p className="mt-2 text-pretty text-zinc-700 dark:text-zinc-300 text-center">
                        Vandalisme, comportements suspects, manque de sécurité routière.
                    </p>
                </motion.div>

                <motion.div 
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                    variants={itemVariants}
                >
                    <div className='flex items-center justify-center w-full'>
                        <div className="inline-flex items-center justify-center rounded-lg bg-zinc-100 p-3 text-zinc-700 dark:text-zinc-300">
                        <BoxIcon className='size-6 text-primary'/>
                    </div>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-center">Objets Perdus</h3>

                    <p className="mt-2 text-pretty text-zinc-700 dark:text-zinc-300 text-center">
                        Signalez un objet que vous avez trouvé ou perdu en ville.
                    </p>
                </motion.div>

            </motion.div>
        </div>
    )
}

export default FeatureSection