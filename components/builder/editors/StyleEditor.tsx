import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AlignLeft, AlignCenter, AlignRight, Type, PaintBucket, BoxSelect } from 'lucide-react';
import { BuilderElement, useBuilderStore } from '@/store/useBuilderStore';

export function StyleEditor({ element }: { element: BuilderElement }) {
    const { updateElement } = useBuilderStore();

    const handleChange = (key: string, value: any) => {
        updateElement(element.id, {
            styles: { ...element.styles, [key]: value }
        });
    };

    const styles = element.styles || {};

    return (
        <div className="space-y-6">
            {/* Typography */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Type className="h-3 w-3" /> Typography
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs">Font Size (px)</Label>
                        <Input
                            type="number"
                            value={styles.fontSize || ''} // Default usually handled by CSS, stored as string or number
                            onChange={(e) => handleChange('fontSize', e.target.value)}
                            placeholder="16"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Font Weight</Label>
                        <Input
                            type="number"
                            step="100"
                            min="100"
                            max="900"
                            value={styles.fontWeight || ''}
                            onChange={(e) => handleChange('fontWeight', e.target.value)}
                            placeholder="400"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Text Align</Label>
                    <ToggleGroup type="single" value={styles.textAlign || 'left'} onValueChange={(val) => val && handleChange('textAlign', val)}>
                        <ToggleGroupItem value="left" size="sm" className="flex-1"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                        <ToggleGroupItem value="center" size="sm" className="flex-1"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                        <ToggleGroupItem value="right" size="sm" className="flex-1"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Text Color</Label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            className="w-10 p-1 h-8 cursor-pointer"
                            value={styles.color || '#000000'}
                            onChange={(e) => handleChange('color', e.target.value)}
                        />
                        <Input
                            value={styles.color || ''}
                            onChange={(e) => handleChange('color', e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                        />
                    </div>
                </div>
            </div>

            <div className="h-px bg-border" />

            {/* Appearance */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <PaintBucket className="h-3 w-3" /> Appearance
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Background Color</Label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            className="w-10 p-1 h-8 cursor-pointer"
                            value={styles.backgroundColor || '#ffffff'}
                            onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        />
                        <Input
                            value={styles.backgroundColor || ''}
                            onChange={(e) => handleChange('backgroundColor', e.target.value)}
                            placeholder="transparent"
                            className="flex-1"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs">Border Radius (px)</Label>
                        <Input
                            type="number"
                            value={styles.borderRadius || ''}
                            onChange={(e) => handleChange('borderRadius', e.target.value)}
                            placeholder="0"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Opacity (%)</Label>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            value={styles.opacity !== undefined ? styles.opacity * 100 : ''}
                            onChange={(e) => handleChange('opacity', parseInt(e.target.value) / 100)}
                            placeholder="100"
                        />
                    </div>
                </div>
            </div>

            <div className="h-px bg-border" />

            {/* Layout / Spacing */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <BoxSelect className="h-3 w-3" /> Spacing
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs">Padding (px)</Label>
                        <Input
                            value={styles.padding || ''}
                            onChange={(e) => handleChange('padding', e.target.value)}
                            placeholder="e.g. 16px or 4px 8px"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Margin (px)</Label>
                        <Input
                            value={styles.margin || ''}
                            onChange={(e) => handleChange('margin', e.target.value)}
                            placeholder="e.g. 16px auto"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Width</Label>
                    <Input
                        value={styles.width || ''}
                        onChange={(e) => handleChange('width', e.target.value)}
                        placeholder="100% or 500px"
                    />
                </div>
            </div>
        </div>
    );
}
