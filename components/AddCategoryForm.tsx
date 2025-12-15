'use client'
import { addReportCategory } from '@/app/(actions)/actions'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Credenza, CredenzaBody, CredenzaClose, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from './Credenza'
import { BellRing, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'

type Props = {
    children: React.ReactNode
}
const AddCategoryForm = ({ children }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleAddCategory = async () => {
        try {
            setIsSubmitting(true);
            const response = await addReportCategory({
                name: name,
                description: description
            });
            toast.success("Catégorie ajoutée avec succès.");
            setName("");
            setDescription("");
            setIsOpen(false);
        } catch (error) {
            toast.error("Une erreur est survenue lors de l'ajout de la catégorie.");
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <Credenza open={isOpen} onOpenChange={setIsOpen}>
            <CredenzaTrigger asChild>
                {children}
            </CredenzaTrigger>

            <CredenzaContent className="border-none shadow-xl dark:bg-zinc-900 mx-0.5">
                <CredenzaHeader className="pb-2">
                    <CredenzaTitle className="text-3xl font-semibold text-primary flex items-center justify-between">
                        <span className="text-xl font-bold flex items-center gap-0.5">
                            <BellRing className='size-5 text-primary' />
                            <span className="text-primary">Vigicité</span>
                        </span>
                    </CredenzaTitle>
                    <CredenzaDescription className="text-gray-500 text-sm italic">
                        Faites de votre ville un endroit plus sûr et plus agréable.
                    </CredenzaDescription>
                </CredenzaHeader>

                <CredenzaBody className='space-y-4'>
                    <Input
                        className=''
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom de la catégorie"
                        disabled={isSubmitting}
                    />
                    <Textarea
                        className='max-h-24'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description de la catégorie (optionnel)"
                        disabled={isSubmitting}
                    />
                </CredenzaBody>
                <CredenzaFooter className='flex flex-row items-center gap-4 w-full border-t pt-2 mx-2'>
                    <CredenzaClose asChild>
                        <Button variant={"outline"}>
                            Annuler
                        </Button>
                    </CredenzaClose>

                    <Button className='' onClick={handleAddCategory} disabled={isSubmitting || name.trim() === ""}>
                        {isSubmitting ? <Loader2 className='size-3 animate-spin' /> : 'Ajouter'}
                    </Button>
                </CredenzaFooter>
            </CredenzaContent>
        </Credenza>
    )
}

export default AddCategoryForm