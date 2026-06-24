import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext, useFormState } from 'react-hook-form';

import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';

export default function InvitationTextsStep() {
  const { register, control } =
    useFormContext<CreateUpdateInvitationFormValues>();
  const { errors } = useFormState({ control });

  return (
    <div className="space-y-6">
      <div className="border-border/40 border-b pb-4">
        <h3 className="text-foreground font-serif text-lg font-bold tracking-tight">
          Kata & Pesan Sambutan
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Sesuaikan kata pengantar, salam sambutan, hingga ucapan penutup pada
          undangan Anda.
        </p>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {/* TEKS COVER */}
        <AccordionItem
          value="teks-cover"
          className="border-border/60 hover:bg-secondary/5 rounded-2xl border bg-transparent px-5 py-2 transition-colors duration-200 last:border-b"
        >
          <AccordionTrigger className="px-2 hover:no-underline">
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold">Teks Cover Depan</span>
              <span className="text-muted-foreground text-xs font-normal">
                Teks pengantar, salam pembuka di sampul, dan kutipan (quote).
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 px-2 pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground text-[11px] font-bold">
                  Teks Pengantar (Pre-heading){' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Contoh: The Wedding of, Walimatul Ursy"
                  {...register('prefixTitle')}
                  className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
                />
                {errors.prefixTitle?.message && (
                  <p className="text-destructive px-1 text-[10px] font-medium">
                    {errors.prefixTitle.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-[11px] font-bold">
                  Salam Sampul (Greeting){' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Contoh: With Love,"
                  {...register('coverGreeting')}
                  className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
                />
                {errors.coverGreeting?.message && (
                  <p className="text-destructive px-1 text-[10px] font-medium">
                    {errors.coverGreeting.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-[11px] font-bold">
                Kutipan / Ayat Sampul (Quote){' '}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder='Contoh: "Two souls with but a single thought, two hearts that beat as one."'
                {...register('coverQuote')}
                className="border-border/60 focus:ring-primary/20 focus:border-primary min-h-[70px] rounded-xl bg-transparent px-4 py-2 text-xs shadow-sm transition-all focus:ring-2"
              />
              {errors.coverQuote?.message && (
                <p className="text-destructive px-1 text-[10px] font-medium">
                  {errors.coverQuote.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-[11px] font-bold">
                Judul Utama Acara <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Contoh: We Are Getting Married, Save The Date"
                {...register('heroTitle')}
                className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
              />
              {errors.heroTitle?.message && (
                <p className="text-destructive px-1 text-[10px] font-medium">
                  {errors.heroTitle.message as string}
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* TEKS SAMBUTAN */}
        <AccordionItem
          value="teks-sambutan"
          className="border-border/60 hover:bg-secondary/5 rounded-2xl border bg-transparent px-5 py-2 transition-colors duration-200 last:border-b"
        >
          <AccordionTrigger className="px-2 hover:no-underline">
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold">Teks Sambutan</span>
              <span className="text-muted-foreground text-xs font-normal">
                Salam pembuka dan pesan undangan untuk tamu.
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 px-2 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground text-[11px] font-bold">
                  Salam Pembuka <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  placeholder="Contoh: Assalamu'alaikum Wr. Wb."
                  {...register('openingGreeting')}
                  className="border-border/60 focus:ring-primary/20 focus:border-primary min-h-[100px] rounded-xl bg-transparent px-4 py-2 text-xs shadow-sm transition-all focus:ring-2"
                />
                {errors.openingGreeting?.message && (
                  <p className="text-destructive px-1 text-[10px] font-medium">
                    {errors.openingGreeting.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-foreground text-[11px] font-bold">
                  Pesan Pembuka <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  placeholder="Contoh: Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i pada acara pernikahan kami."
                  {...register('openingMessage')}
                  className="border-border/60 focus:ring-primary/20 focus:border-primary min-h-[100px] rounded-xl bg-transparent px-4 py-2 text-xs shadow-sm transition-all focus:ring-2"
                />
                {errors.openingMessage?.message && (
                  <p className="text-destructive px-1 text-[10px] font-medium">
                    {errors.openingMessage.message as string}
                  </p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* TEKS PENUTUP */}
        <AccordionItem
          value="teks-penutup"
          className="border-border/60 hover:bg-secondary/5 rounded-2xl border bg-transparent px-5 py-2 transition-colors duration-200 last:border-b"
        >
          <AccordionTrigger className="px-2 hover:no-underline">
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold">Teks Penutup</span>
              <span className="text-muted-foreground text-xs font-normal">
                Ucapan terima kasih dan salam penutup di bagian akhir.
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 px-2 pt-4">
            <div className="space-y-2">
              <Label className="text-foreground text-[11px] font-bold">
                Pesan Penutup <span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder="Contoh: Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir."
                {...register('closingMessage')}
                className="border-border/60 focus:ring-primary/20 focus:border-primary min-h-[80px] rounded-xl bg-transparent px-4 py-2 text-xs shadow-sm transition-all focus:ring-2"
              />
              {errors.closingMessage?.message && (
                <p className="text-destructive px-1 text-[10px] font-medium">
                  {errors.closingMessage.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-[11px] font-bold">
                Ucapan Terima Kasih & Salam Penutup{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Contoh: Wassalamu'alaikum Wr. Wb. / Terima Kasih"
                {...register('closingGreeting')}
                className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
              />
              {errors.closingGreeting?.message && (
                <p className="text-destructive px-1 text-[10px] font-medium">
                  {errors.closingGreeting.message as string}
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
