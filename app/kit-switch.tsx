'use client';
import { Switch } from '@base-ui/react/switch';

// Own the thumb layout here: the shared switch's state-specific translate
// utilities must not be combined with this fixed-position branded track.
export default function KitSwitch({checked,onCheckedChange}:{checked:boolean;onCheckedChange:(checked:boolean)=>void}) {
 return <Switch.Root className="gear-switch" checked={checked} onCheckedChange={onCheckedChange} aria-label="Include matching goggles"><Switch.Thumb data-slot="switch-thumb" /></Switch.Root>;
}
