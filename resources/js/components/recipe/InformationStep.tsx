import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface InformationStepProps {
  data: {
    title: string;
    description: string;
    servings: number;
    difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';
    prep_time_minutes: number;
    cook_time_minutes: number;
    image?: File;
    youtube_url: string;
    is_public: boolean;
  };
  setData: (data: Partial<InformationStepProps['data']>) => void;
  errors: Record<string, string>;
}

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
];

export default function InformationStep({ data, setData, errors }: InformationStepProps) {
  return (
    <div className="space-y-6">
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        value={data.title}
        onChange={e => setData({ title: e.target.value })}
        placeholder="Recipe title"
        className={errors.title ? 'border-red-500' : ''}
      />
      {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

      <Label htmlFor="description">Description</Label>
      <Input
        id="description"
        value={data.description}
        onChange={e => setData({ description: e.target.value })}
        placeholder="Short description"
        className={errors.description ? 'border-red-500' : ''}
      />
      {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

      <Label htmlFor="servings">Servings</Label>
      <Input
        id="servings"
        type="number"
        value={data.servings}
        onChange={e => {
          const value = e.target.value;
          if (value === '') {
            setData({ servings: '' as any }); // Allow empty during editing
          } else {
            const parsed = parseInt(value, 10);
            if (!isNaN(parsed) && parsed >= 1) {
              setData({ servings: parsed });
            }
          }
        }}
        onBlur={e => {
          const value = e.target.value;
          if (value === '' || isNaN(parseInt(value, 10))) {
            setData({ servings: 1 }); // Set to minimum when field loses focus
          }
        }}
        min={1}
        className={errors.servings ? 'border-red-500' : ''}
      />
      {errors.servings && <p className="text-red-500 text-sm">{errors.servings}</p>}

      <Label htmlFor="difficulty">Difficulty</Label>
      <select
        id="difficulty"
        value={data.difficulty}
        onChange={e => setData({ difficulty: e.target.value as InformationStepProps['data']['difficulty'] })}
        className={`w-full px-3 py-2 border rounded-md ${errors.difficulty ? 'border-red-500' : 'border-gray-300'}`}
      >
        {DIFFICULTY_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {errors.difficulty && <p className="text-red-500 text-sm">{errors.difficulty}</p>}

      <Label htmlFor="prep_time_minutes">Prep Time (minutes)</Label>
      <Input
        id="prep_time_minutes"
        type="number"
        value={data.prep_time_minutes}
        onChange={e => {
          const value = e.target.value;
          if (value === '') {
            setData({ prep_time_minutes: '' as any }); // Allow empty during editing
          } else {
            const parsed = parseInt(value, 10);
            if (!isNaN(parsed) && parsed >= 0) {
              setData({ prep_time_minutes: parsed });
            }
          }
        }}
        onBlur={e => {
          const value = e.target.value;
          if (value === '' || isNaN(parseInt(value, 10))) {
            setData({ prep_time_minutes: 0 }); // Set to minimum when field loses focus
          }
        }}
        min={0}
        className={errors.prep_time_minutes ? 'border-red-500' : ''}
      />
      {errors.prep_time_minutes && <p className="text-red-500 text-sm">{errors.prep_time_minutes}</p>}

      <Label htmlFor="cook_time_minutes">Cook Time (minutes)</Label>
      <Input
        id="cook_time_minutes"
        type="number"
        value={data.cook_time_minutes}
        onChange={e => {
          const value = e.target.value;
          if (value === '') {
            setData({ cook_time_minutes: '' as any }); // Allow empty during editing
          } else {
            const parsed = parseInt(value, 10);
            if (!isNaN(parsed) && parsed >= 0) {
              setData({ cook_time_minutes: parsed });
            }
          }
        }}
        onBlur={e => {
          const value = e.target.value;
          if (value === '' || isNaN(parseInt(value, 10))) {
            setData({ cook_time_minutes: 0 }); // Set to minimum when field loses focus
          }
        }}
        min={0}
        className={errors.cook_time_minutes ? 'border-red-500' : ''}
      />
      {errors.cook_time_minutes && <p className="text-red-500 text-sm">{errors.cook_time_minutes}</p>}

      <Label htmlFor="youtube_url">YouTube URL</Label>
      <Input
        id="youtube_url"
        value={data.youtube_url}
        onChange={e => setData({ youtube_url: e.target.value })}
        placeholder="https://youtube.com/..."
        className={errors.youtube_url ? 'border-red-500' : ''}
      />
      {errors.youtube_url && <p className="text-red-500 text-sm">{errors.youtube_url}</p>}

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="is_public" className="text-base">
            Make Recipe Public
          </Label>
          <div className="text-sm text-gray-500">
            Allow other users to view and search for this recipe
          </div>
        </div>
        <Switch
          id="is_public"
          checked={data.is_public}
          onCheckedChange={(checked) => setData({ is_public: checked })}
        />
      </div>
      {errors.is_public && <p className="text-red-500 text-sm">{errors.is_public}</p>}
    </div>
  );
}
