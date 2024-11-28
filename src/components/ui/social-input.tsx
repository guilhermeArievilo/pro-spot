import * as React from 'react';
import PlusIcon from '@/assets/svg/icons/plus.svg';
import EditIcon from '@/assets/svg/icons/edit.svg';
import TrashIcon from '@/assets/svg/icons/trash.svg';
import SaveIcon from '@/assets/svg/icons/save.svg';
import CloseIcon from '@/assets/svg/icons/close.svg';

import { Button } from './button';
import { Input } from './input';

export interface SocialInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode;
}

const SocialInput = React.forwardRef<HTMLInputElement, SocialInputProps>(
  ({ className, type, children, ...props }, ref) => {
    const [toggleInput, setToggleInput] = React.useState(false);

    function toogleInputTrigger() {
      setToggleInput(!toggleInput);
    }

    function cleanValue() {
      onChangeValue('');
    }

    function onChangeValue(value: string) {
      if (props && props.onChange) {
        const input = document.createElement('input');
        input.value = value;

        // Cria o evento base
        const event = new Event('input', { bubbles: true, cancelable: true });

        // Adiciona as propriedades necessárias do ChangeEvent
        const changeEvent: React.ChangeEvent<HTMLInputElement> = {
          target: input,
          currentTarget: input,
          bubbles: event.bubbles,
          cancelable: event.cancelable,
          defaultPrevented: event.defaultPrevented,
          eventPhase: event.eventPhase,
          isTrusted: event.isTrusted,
          nativeEvent: event as any,
          preventDefault: event.preventDefault.bind(event),
          stopPropagation: event.stopPropagation.bind(event),
          persist: () => {},
          isDefaultPrevented: event.defaultPrevented ? () => true : () => false,
          isPropagationStopped: event.cancelBubble ? () => true : () => false,
          timeStamp: event.timeStamp,
          type: event.type
        };

        props.onChange(changeEvent);
      }
    }
    return (
      <div className="w-fit flex items-center gap-2 p-2 dark:bg-dark-surfaceContainerLow bg-light-surfaceContainerLow rounded-full">
        <div>{children}</div>
        {toggleInput ? (
          <Input
            type={type}
            ref={ref}
            {...props}
            placeholder={props.placeholder}
            className="py-2"
          />
        ) : (
          <span className="max-w-52 overflow-hidden text-ellipsis">
            {props.value || ''}
          </span>
        )}
        <Button
          variant={'ghost'}
          type="button"
          className="p-2"
          onClick={toogleInputTrigger}
        >
          {props.value ? (
            !toggleInput ? (
              <EditIcon className="stroke-foreground" />
            ) : (
              <SaveIcon className="stroke-foreground" />
            )
          ) : !toggleInput ? (
            <PlusIcon className="stroke-foreground" />
          ) : (
            <CloseIcon className="stroke-foreground" />
          )}
        </Button>
        {props.value && (
          <Button
            variant={'ghost'}
            type="button"
            className="p-2"
            onClick={cleanValue}
          >
            <TrashIcon />
          </Button>
        )}
      </div>
    );
  }
);
SocialInput.displayName = 'SocialInput';

export { SocialInput };
