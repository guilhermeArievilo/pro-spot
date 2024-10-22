import { Button } from '../ui/button';
import ShareIcon from '@/assets/svg/icons/share.svg';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { RadioGroup, RadioGroupBlockItem } from '../ui/radio-group';

interface TopBodyMenuProps {
  pageName: string;
  views: number;
  clicks: number;
  onSharedPress: () => void;
  options: {
    label: string;
    value: string;
  }[];
  defaultOption?: string;
  onOptionChange: (optionValue: string) => void;
}

export default function TopBodyMenu({
  pageName,
  views,
  clicks,
  onSharedPress,
  options,
  defaultOption,
  onOptionChange
}: TopBodyMenuProps) {
  return (
    <div className="flex justify-between gap-10">
      <div className="navigation">
        <RadioGroup
          defaultValue={defaultOption}
          onValueChange={onOptionChange}
          className="w-fit flex rounded-lg gap-0"
        >
          {options.map(({ label, value }) => (
            <RadioGroupBlockItem
              value={value}
              key={value}
              className="text-sm first:border-r last:border-l rounded-none w-fit px-6 data-[state=checked]:bg-transparent data-[state=unchecked]:bg-transparent data-[state=unchecked]:opacity-60"
            >
              {label}
            </RadioGroupBlockItem>
          ))}
        </RadioGroup>
      </div>
      <div className="flex justify-center items-center gap-6">
        <div className="flex items-center gap-2 pt-2">
          <span>{views} Visitas</span>
          <span className="w-1 h-1 rounded-full bg-foreground" />
          <span>{clicks} Cliques</span>
        </div>
        <div className="flex gap-2">
          <span className="text-4xl pt-2">{pageName}</span>
          <Button
            type="button"
            variant={'ghost'}
            onClick={onSharedPress}
            className="rounded-full h-fit w-fit"
          >
            <ShareIcon className="stroke-foreground w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
