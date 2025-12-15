'use client'

import Image from 'next/image'
import { ArrowRight, Calendar, ChevronRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const RecentSection = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut" as const
            }
        }
    }

    return (
        <section className='mx-auto max-w-7xl px-4  sm:px-6 lg:px-8 mt-16' ref={ref}>
            <motion.div 
                className="mx-auto max-w-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl/tight font-bold sm:text-4xl">Incidents Récents sur la Carte</h2>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                <motion.div 
                    className='w-full h-full flex flex-col gap-3 justify-center'
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Image
                        className="md:block rounded-xl"
                        src={"/img2.png"}
                        alt="Hero Image"
                        width={600}
                        height={400}
                    />

                    <div className=''>
                        <Link href="/map" className='mt-4 text-primary font-semibold hover:underline'>
                            <Button className='flex items-center gap-2 group'>
                                Voir la carte complète
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div 
                    className='w-full space-y-2'
                    variants={listVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    <motion.div 
                        className='flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-700 p-2 hover:shadow-md hover:border-primary/50 transition-all duration-300 cursor-pointer'
                        variants={itemVariants}
                    >
                        <Image
                            className="md:block rounded-lg"
                            src={"/nid.jpg"}
                            alt="Hero Image"
                            width={70}
                            height={70}
                        />

                        <div>
                            <h4 className='font-semibold'>Nids de poule</h4>
                            <div className='flex items-center justify-between gap-4'>
                                <div className='flex items-center text-sm'>
                                    <MapPin className='size-3 text-primary mr-2' />
                                    12/10/Akassato
                                </div>

                                <div className='flex items-center text-sm'>
                                    <Calendar className='size-3 text-primary mr-2' />
                                    12/10/2024
                                </div>
                            </div>
                        </div>

                        <div>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </motion.div>
                    <motion.div 
                        className='flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-700 p-2 hover:shadow-md hover:border-primary/50 transition-all duration-300 cursor-pointer'
                        variants={itemVariants}
                    >
                        <Image
                            className="md:block rounded-lg"
                            src={"/ordures.jpg"}
                            alt="Hero Image"
                            width={70}
                            height={70}
                        />

                        <div>
                            <h4 className='font-semibold'>Dépots sauvages d&apos;ordures</h4>
                            <div className='flex items-center justify-between gap-4'>
                                <div className='flex items-center text-sm'>
                                    <MapPin className='size-3 text-primary mr-2' />
                                    12/10/Akassato
                                </div>

                                <div className='flex items-center text-sm'>
                                    <Calendar className='size-3 text-primary mr-2' />
                                    12/10/2024
                                </div>
                            </div>
                        </div>

                        <div>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </motion.div>
                    <motion.div 
                        className='flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-700 p-2 hover:shadow-md hover:border-primary/50 transition-all duration-300 cursor-pointer'
                        variants={itemVariants}
                    >
                        <Image
                            className="md:block rounded-lg"
                            src={"/cars.jpg"}
                            alt="Hero Image"
                            width={70}
                            height={70}
                        />

                        <div>
                            <h4 className='font-semibold'>Accident de voitures</h4>
                            <div className='flex items-center justify-between gap-4'>
                                <div className='flex items-center text-sm'>
                                    <MapPin className='size-3 text-primary mr-2' />
                                    12/10/Abomey
                                </div>

                                <div className='flex items-center text-sm'>
                                    <Calendar className='size-3 text-primary mr-2' />
                                    12/10/2024
                                </div>
                            </div>
                        </div>

                        <div>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </motion.div>
                    <motion.div 
                        className='flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-700 p-2 hover:shadow-md hover:border-primary/50 transition-all duration-300 cursor-pointer'
                        variants={itemVariants}
                    >
                        <Image
                            className="md:block rounded-lg"
                            src={"/camion.png"}
                            alt="Hero Image"
                            width={70}
                            height={70}
                        />

                        <div>
                            <h4 className='font-semibold'>Camion bloquant la voie</h4>
                            <div className='flex items-center justify-between gap-4'>
                                <div className='flex items-center text-sm'>
                                    <MapPin className='size-3 text-primary mr-2' />
                                    12/10/Natitingou
                                </div>

                                <div className='flex items-center text-sm'>
                                    <Calendar className='size-3 text-primary mr-2' />
                                    12/10/2024
                                </div>
                            </div>
                        </div>

                        <div>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default RecentSection