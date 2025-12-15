'use client'

import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

const HeroSection = () => {
    return (
        <section className="bg-whited lg:grid lg:h-scrdeen lg:place-content-center">
            <div className="mx-auto w-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-2 lg:px-4 lg:py-16 pb-2 ">
                <motion.div
                    className="max-w-prose text-left"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <motion.h1
                        className="text-4xl font-bold text-gray-900 sm:text-5xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    >
                        <strong className="text-primary"> Vigicité </strong>
                    </motion.h1>

                    <motion.p
                        className="mt-4 text-base text-pretty text-gray-700 dark:text-gray-300 sm:text-lg/relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                    >
                        Signalez facilement les incidents urbains, des infrastructures défaillantes aux problèmes de propreté. VeigiCité connecte citoyens et autorités pour une résolution rapide et collaborative.
                    </motion.p>

                    <motion.div
                        className="mt-4 flex gap-4 sm:mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                    >
                        <Link href="/report">
                            <Button className='px-5 py-3 w-full group'>
                                Signaler maintenant
                                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                >
                    <Image
                        className="mx-auto max-w-md text-gray-900 md:block"
                        src={"/img1.png"}
                        alt="Hero Image"
                        width={500}
                        height={550}
                    />
                </motion.div>
            </div>
        </section>
    )
}

export default HeroSection