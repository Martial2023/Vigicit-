import React from 'react'
import Link from 'next/link'
import { BellRing, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900 border-t mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-1">
              <BellRing className='size-5 text-primary dark:text-white'/>
              <span className="text-primary dark:text-white">Vigicité</span>
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Une plateforme citoyenne pour une cité plus à l'écoute et plus proche
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
                <Facebook className="size-5" />
              </Link>
              <Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
                <Twitter className="size-5" />
              </Link>
              <Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
                <Instagram className="size-5" />
              </Link>
              <Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
                <Linkedin className="size-5" />
              </Link>
            </div>
          </div>

          {/* Liens Rapides */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/signaler" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
                  Signaler un incident
                </Link>
              </li>
              <li>
                <Link href="/carte" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
                  Consulter la carte
                </Link>
              </li>
            </ul>
          </div>

          {/* VuoCoCo Propos */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">VuoCoCo Propos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/a-propos" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/devenir-acteur" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
                  Devenir acteur
                </Link>
              </li>
            </ul>
          </div>

          {/* LiuObeLegal */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">LiuObeLegal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/confidentialite" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/conditions" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/lignes-directrices" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
                  Lignes directrices de signalement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            © 2025 VigiCité. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer