import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '@/lib/supabase';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export async function uploadToStorage({ bucket, file, folder = '' }) {
	if (!supabase) throw new Error('Supabase not configured');
	if (!file) throw new Error('No file provided');
	const fileExt = file.name?.split?.('.')?.pop?.() || 'bin';
	const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
	const { error } = await supabase.storage.from(bucket).upload(fileName, file, { cacheControl: '3600', upsert: false });
	if (error) throw error;
	const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
	return { path: fileName, publicUrl: data.publicUrl };
}
