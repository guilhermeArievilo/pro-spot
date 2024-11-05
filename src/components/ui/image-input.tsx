'use client';
import * as React from 'react';
import { Avatar, AvatarImage } from './avatar';
import { Button } from './button';
import PlusIcon from '@/assets/svg/icons/plus.svg';
import TrashIcon from '@/assets/svg/icons/trash.svg';
import EditIcon from '@/assets/svg/icons/edit.svg';
import { Media } from '@/application/entities';

interface ImageInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  image?: Media;
  src?: string;
  enableDelete?: boolean;
  onDelete?: () => void;
}

const ImageInput = React.forwardRef<HTMLInputElement, ImageInputProps>(
  (
    {
      className,
      type,
      image,
      src,
      onDelete,
      value,
      onChange,
      enableDelete,
      ...props
    },
    ref
  ) => {
    const localRef = React.useRef<HTMLInputElement>(null);
    function openFileSelectModal() {
      localRef.current?.click();
    }

    const [previewUrl, setImageURL] = React.useState<string>();

    const uploadImageToClient = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      if (event.target.files && event.target.files[0]) {
        const url = URL.createObjectURL(event.target.files[0]);
        setImageURL(url);
      }
    };

    return (
      <div
        className={`w-fit flex items-center gap-3 dark:bg-dark-surfaceContainerLow bg-light-surfaceContainerLow rounded-full p-2 ${className}`}
      >
        {(previewUrl || image?.src) && (
          <Avatar>
            <AvatarImage
              src={previewUrl || image?.src}
              className="object-cover"
            />
          </Avatar>
        )}
        <Button
          variant={'ghost'}
          type="button"
          className="p-2"
          onClick={openFileSelectModal}
        >
          {previewUrl || image?.src || value ? <EditIcon /> : <PlusIcon />}
        </Button>

        {(previewUrl || image?.src || value) && enableDelete && (
          <Button
            variant={'ghost'}
            type="button"
            className="p-2"
            onClick={onDelete}
          >
            <TrashIcon />
          </Button>
        )}
        <input
          ref={mergeRefs(ref, localRef)}
          className="hidden"
          {...props}
          onChange={(e) => {
            uploadImageToClient(e);
            if (onChange) {
              onChange(e);
            }
          }}
          type="file"
          accept="image/*"
          id="img-input"
        />
      </div>
    );
  }
);

// Tipagem para a função mergeRefs
function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (element: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(element); // Chama o ref callback
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<T | null>).current = element; // Atualiza o ref com .current
      }
    });
  };
}

ImageInput.displayName = 'ImageInput';

export { ImageInput };
