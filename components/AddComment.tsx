"use client"
import React, { useState } from 'react'
import {
    Credenza,
    CredenzaBody,
    CredenzaClose,
    CredenzaContent,
    CredenzaDescription,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from "@/components/Credenza"
import { BellRing, Loader2 } from 'lucide-react'
import { Textarea } from './ui/textarea'
import { useCurrentUser } from '@/lib/useCurrentUser'
import { toast } from 'sonner'
import { commentReport } from '@/app/(actions)/actions'
import { ReportWithCommentsProps } from '@/types'
import { Button } from './ui/button'

type Props = {
    children?: React.ReactNode
    report: ReportWithCommentsProps
    setReportData: React.Dispatch<React.SetStateAction<ReportWithCommentsProps>>
}
const AddComment = ({ children, report, setReportData }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const user = useCurrentUser()

    const handleCommenting = async () => {
        try {
            if (!user) {
                toast.error("Vous devez être connecté pour ajouter un commentaire.");
                return;
            }
            setIsSubmitting(true);
            const response = await commentReport(
                report.id,
                content               
            );
            toast.success("Commentaire ajouté avec succès.");
            setContent("");
            setIsOpen(false);
            setReportData({
                ...report,
                comments: [...report.comments, response]
            })
        } catch (error) {
            toast.error("Une erreur est survenue lors de l'ajout du commentaire.");
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

                <CredenzaBody>
                    <Textarea
                        className='max-h-24'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Écrire un commentaire..."
                        disabled={isSubmitting}
                    />
                </CredenzaBody>
                <CredenzaFooter className='flex flex-row items-center gap-4 w-full border-t pt-2 mx-2'>
                    <CredenzaClose asChild>
                        <Button variant={"outline"}>
                            Annuler
                        </Button>
                    </CredenzaClose>

                    <Button className='' onClick={handleCommenting} disabled={isSubmitting || content.trim() === ""}>
                        { isSubmitting? <Loader2 className='size-3 animate-spin'/> : 'Commenter' }
                    </Button>
                </CredenzaFooter>
            </CredenzaContent>
        </Credenza>
    )
}

export default AddComment