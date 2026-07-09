import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePermission } from '@/hooks/use-permission';
import { useToast } from '@/hooks/use-toast';
import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';
import { IKContext, IKUpload } from 'imagekitio-react';
import {
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  FieldError,
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';

export default function InvitationGalleryStep() {
  const { toast } = useToast();
  const { getQuota } = usePermission();
  const { register, control, setValue, clearErrors } =
    useFormContext<CreateUpdateInvitationFormValues>();
  const { errors } = useFormState({ control, name: 'gallery' });

  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const galleryValues = useWatch({ control, name: 'gallery' });

  const photoLimit = getQuota('photo_limit');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'gallery',
  });

  const canAddMore = fields.length < photoLimit;

  const authenticator = async () => {
    try {
      const response = await fetch('/api/imagekit/auth');
      if (!response.ok) {
        throw new Error('Gagal mendapatkan token otentikasi');
      }
      return await response.json();
    } catch {
      throw new Error('Authentication request failed');
    }
  };

  return (
    <IKContext
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div className="space-y-6">
        <div className="border-border/40 border-b pb-4">
          <h3 className="text-foreground font-serif text-lg font-bold tracking-tight">
            Galeri Foto{' '}
            <span className="text-muted-foreground ml-2 text-sm font-normal">
              ({fields.length} / {photoLimit})
            </span>
          </h3>
          <p className="text-muted-foreground mt-1 text-xs">
            Tambahkan foto-foto momen kebersamaan Anda untuk ditampilkan pada
            halaman undangan. Maksimal {photoLimit} foto.
          </p>
        </div>

        {fields.length === 0 && (
          <div className="border-border/40 flex flex-col items-center justify-center rounded-2xl border border-dashed py-12 text-center">
            <div className="bg-primary/5 text-primary mb-4 rounded-full p-3">
              <ImageIcon className="h-6 w-6" />
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Unggah foto-foto terbaik Anda untuk ditampilkan di undangan.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canAddMore}
              onClick={() => {
                append({ imageUrl: '' });
                clearErrors('gallery');
              }}
              className="hover:bg-primary/5 hover:text-primary mt-4 rounded-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Foto Pertama
            </Button>
            {errors.gallery?.message && (
              <p className="text-destructive mt-3 text-[10px] font-bold">
                {errors.gallery.message as string}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field, index) => {
            const galleryErrors = (
              errors.gallery as unknown as Record<string, FieldError>[]
            )?.[index];
            const isUploading = uploadingIndex === index;
            const currentUrl = galleryValues?.[index]?.imageUrl;

            return (
              <div
                key={field.id}
                className="border-border/60 bg-secondary/10 relative flex items-start gap-3 rounded-2xl border p-4 transition-colors"
              >
                <div className="border-border/40 bg-muted/30 relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border">
                  {isUploading ? (
                    <Loader2 className="text-primary h-6 w-6 animate-spin" />
                  ) : currentUrl && currentUrl.startsWith('http') ? (
                    <Image
                      src={currentUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <ImageIcon className="text-muted-foreground/50 h-8 w-8" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <Label className="text-foreground text-[11px] font-bold">
                    Upload Foto #{index + 1}{' '}
                    <span className="text-destructive">*</span>
                  </Label>

                  <div className="flex flex-col items-start gap-2">
                    <div className="bg-primary hover:bg-primary-dark relative inline-flex h-9 w-max cursor-pointer items-center justify-center rounded-sm px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors">
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Mengunggah...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-3.5 w-3.5" />
                          {currentUrl ? 'Ganti Foto' : 'Pilih Foto'}
                        </>
                      )}

                      <IKUpload
                        fileName="gallery"
                        useUniqueFileName={true}
                        folder="/wevin-gallery"
                        accept="image/*"
                        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                          (e.target as HTMLInputElement).value = '';
                        }}
                        validateFile={(file: File) => {
                          if (file.size > 5 * 1024 * 1024) {
                            toast({
                              title: 'File Terlalu Besar',
                              description: 'Ukuran foto maksimal adalah 5MB.',
                              variant: 'destructive',
                            });
                            return false;
                          }
                          return true;
                        }}
                        onUploadStart={() => setUploadingIndex(index)}
                        onError={(err: { errorMessage?: string }) => {
                          setUploadingIndex(null);
                          toast({
                            title: 'Upload Gagal',
                            description:
                              err.errorMessage ||
                              'Gagal mengunggah foto. Silakan coba lagi.',
                            variant: 'destructive',
                          });
                        }}
                        onSuccess={(res: { url: string }) => {
                          setUploadingIndex(null);
                          setValue(`gallery.${index}.imageUrl`, res.url, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </div>
                  </div>

                  <Input
                    type="hidden"
                    {...register(`gallery.${index}.imageUrl`)}
                  />
                  {galleryErrors?.imageUrl?.message && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {galleryErrors.imageUrl.message as string}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8 w-8 shrink-0 rounded-full"
                  onClick={() => remove(index)}
                  disabled={isUploading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {fields.length > 0 && canAddMore && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              append({ imageUrl: '' });
              clearErrors('gallery');
            }}
            className="hover:bg-primary/5 hover:text-primary w-full rounded-xl border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Foto Lainnya
          </Button>
        )}
      </div>
    </IKContext>
  );
}
