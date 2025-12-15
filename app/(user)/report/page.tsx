'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import MapPicker from '@/components/MapPicker'
import { Upload, X, Loader2, MapPin, Calendar, FileText, PackageSearch, Siren, Trash2, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ReportCategoryProps, ReportFormDataProps } from '@/types'
import { getReportCategories, submitReport } from '@/app/(actions)/actions'
import { useRouter } from 'next/navigation'
import { generateReactHelpers } from '@uploadthing/react';

const { uploadFiles } = generateReactHelpers();
const ReportPage = () => {
    const router = useRouter()
    const [formData, setFormData] = useState<ReportFormDataProps>({
        title: '',
        categoryId: '',
        description: '',
        address: '',
        geoLocation: {
            latitude: '0',
            longitude: '0',
        },
        date: new Date(),
        contact: '',
        images: [],
        status: "IN_PROGRESS"
    })

    const [photos, setPhotos] = useState<File[]>([])
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [categories, setCategories] = useState<ReportCategoryProps[]>([])
    const [isGettingCategories, setIsGettingCategories] = useState<boolean>(false)

    // Catégories de signalement
    // const categories = [
    //     { value: 'infrastructure', label: 'Infrastructures défaillantes', icon: Wrench },
    //     { value: 'pollution', label: 'Pollution & Déchets', icon: Trash2 },
    //     { value: 'security', label: 'Insécurité', icon: Siren },
    //     { value: 'lost_found', label: 'Objets Perdus/Trouvés', icon: PackageSearch },
    // ]
    const handleGetCategories = async () => {
        try {
            setIsGettingCategories(true)
            const answer = await getReportCategories()
            setCategories(answer)
        } catch (error) {
            toast.error("Erreur lors de la récupération des catégories")
        } finally {
            setIsGettingCategories(false)
        }
    }
    useEffect(() => {
        handleGetCategories()
    }, [])

    // Gestion de la sélection de localisation
    const handleLocationSelect = (lat: number, lng: number) => {
        setFormData((prev) => ({
            ...prev,
            geoLocation: {
                latitude: lat.toString(),
                longitude: lng.toString()
            }
         }))
        setErrors((prev) => ({ ...prev, location: '' }))
    }

    // Gestion des fichiers photos
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        // Limitation à 5 photos max
        if (photos.length + files.length > 5) {
            toast.error('Maximum 5 photos autorisées')
            return
        }

        // Vérification du type et de la taille
        const validFiles = files.filter((file) => {
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                toast.error(`${file.name} : format non supporté`)
                return false
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} : fichier trop volumineux (max 5MB)`)
                return false
            }
            return true
        })

        setPhotos((prev) => [...prev, ...validFiles])

        // Création des previews
        validFiles.forEach((file) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreviews((prev) => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    // Suppression d'une photo
    const handleRemovePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index))
        setPhotoPreviews((prev) => prev.filter((_, i) => i !== index))
    }

    // Validation du formulaire
    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Le titre est requis'
        } else if (formData.title.length < 10) {
            newErrors.title = 'Le titre doit contenir au moins 10 caractères'
        }

        if (!formData.categoryId) {
            newErrors.category = 'Veuillez sélectionner une catégorie'
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La description est requise'
        } else if (formData.description.length < 20) {
            newErrors.description = 'La description doit contenir au moins 20 caractères'
        }

        if (!formData.address.trim()) {
            newErrors.address = 'L\'adresse est requise'
        }

        if (Number(formData.geoLocation.latitude) === 0 && Number(formData.geoLocation.longitude) === 0) {
            newErrors.location = 'Veuillez sélectionner une position sur la carte'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) {
            toast.error('Veuillez corriger les erreurs dans le formulaire')
            return
        }
        try {
            setIsSubmitting(true)

            let imageUrls: string[] = [];
            if (photos.length > 0) {
                const uploadedFiles = await uploadFiles('image', { files: photos });
                imageUrls = uploadedFiles.map(file => file.ufsUrl);
            }

            const report = await submitReport({
                ...formData,
                images: imageUrls
            })

            toast.success('Signalement envoyé avec succès !')
            router.push('/my-reports')

            // Réinitialiser le formulaire
            setFormData({
                title: '',
                categoryId: '',
                description: '',
                address: '',
                geoLocation: {
                    latitude: '0',
                    longitude: '0'
                },
                date: null,
                contact: '',
                status: "IN_PROGRESS",
                images: []
            })
            setPhotos([])
            setPhotoPreviews([])
        } catch (error) {
            toast.error('Erreur lors de l\'envoi du signalement')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-2 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                {/* En-tête */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                        Nouveau Signalement
                    </h1>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                        Aidez à améliorer votre ville en signalant un incident
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Card className="border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="size-5 text-primary" />
                                Détails du Signalement
                            </CardTitle>
                            <CardDescription>
                                Fournissez le plus de détails possible pour aider à la résolution
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Titre */}
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Titre du signalement <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Ex: Nid-de-poule sur rue Principale"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className={`${errors.title
                                        ? 'border-red-500 focus-visible:ring-red-500'
                                        : ''
                                        }`}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">{errors.title}</p>
                                )}
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Le titre doit être concis et descriptif
                                </p>
                            </div>

                            {/* Catégorie */}
                            <div className="space-y-2">
                                <Label htmlFor="category">
                                    Catégorie <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.categoryId}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, categoryId: value })
                                    }
                                >
                                    <SelectTrigger
                                        className={`w-full ${errors.categoryId
                                            ? 'border-red-500 focus:ring-red-500'
                                            : ''
                                            }`}
                                    >
                                        <SelectValue placeholder="Sélectionnez une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id} className='w-full'>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoryId && (
                                    <p className="text-sm text-red-500">{errors.categoryId}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Décrivez l'incident en détail..."
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={5}
                                    className={`resize-none ${errors.description
                                        ? 'border-red-500 focus-visible:ring-red-500'
                                        : ''
                                        }`}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">{errors.description}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Localisation */}
                    <Card className="border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="size-5 text-primary" />
                                Localisation de l&apos;incident
                            </CardTitle>
                            <CardDescription>
                                Sélectionnez l&apos;emplacement exact sur la carte
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Adresse */}
                            <div className="space-y-2">
                                <Label htmlFor="address">
                                    Adresse <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="address"
                                    placeholder="Ex: 123 Rue de la Paix"
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                    className={`${errors.address
                                        ? 'border-red-500 focus-visible:ring-red-500'
                                        : ''
                                        }`}
                                />
                                {errors.address && (
                                    <p className="text-sm text-red-500">{errors.address}</p>
                                )}
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Saisissez une adresse pour la spécification
                                </p>
                            </div>

                            {/* Carte */}
                            <div className="space-y-2">
                                <Label>
                                    Géolocalisation <span className="text-red-500">*</span>
                                </Label>
                                <MapPicker onLocationSelect={handleLocationSelect} />
                                {errors.location && (
                                    <p className="text-sm text-red-500">{errors.location}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Photos */}
                    <Card className="border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="size-5 text-primary" />
                                Pièces Jointes
                            </CardTitle>
                            <CardDescription>
                                Ajoutez des photos (JPEG, PNG, max 5MB par fichier)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="photos">
                                    Ajouter des photos <span className="text-red-500">*</span>
                                </Label>

                                {/* Zone d'upload */}
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="photos"
                                        accept="image/jpeg,image/png,image/jpg"
                                        multiple
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="photos"
                                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                      ${errors.photos
                                                ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                                                : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                            }`}
                                    >
                                        <Upload className="size-8 text-zinc-400 dark:text-zinc-500 mb-2" />
                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Cliquez pour sélectionner
                                        </span>
                                        <span className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                                            Max 5 images (JPEG, PNG, max 5MB)
                                        </span>
                                    </label>
                                </div>

                                {errors.photos && (
                                    <p className="text-sm text-red-500">{errors.photos}</p>
                                )}

                                {/* Previews des photos */}
                                {photoPreviews.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                                        {photoPreviews.map((preview, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 group"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePhoto(index)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="size-4 text-white" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informations complémentaires */}
                    <Card className="border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="size-5 text-primary" />
                                Informations Complémentaires
                            </CardTitle>
                            <CardDescription>Optionnel</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Date et heure */}
                            <div className="space-y-2">
                                <Label htmlFor="date">Date et Heure de l&apos;incident</Label>
                                <Input
                                    id="date"
                                    type="datetime-local"
                                    value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, date: new Date(e.target.value) })
                                    }
                                />
                            </div>

                            {/* Contact */}
                            <div className="space-y-2">
                                <Label htmlFor="contact">Contact (Optionnel)</Label>
                                <Input
                                    id="contact"
                                    type="text"
                                    placeholder="Votre adresse e-mail ou numéro de téléphone"
                                    value={formData.contact}
                                    onChange={(e) =>
                                        setFormData({ ...formData, contact: e.target.value })
                                    }
                                />
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Nous pourrons vous contacter pour plus de détails
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => window.history.back()}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto min-w-[150px]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                'Soumettre'
                            )}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </main>
    )
}

export default ReportPage