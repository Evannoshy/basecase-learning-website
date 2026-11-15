import React from 'react';
import type { Metadata } from 'next';
import { Showcase } from '@/components/sections/Showcase';
import { Courses } from '@/components/sections/Courses';

export const metadata: Metadata = {
  title: 'Projects & Courses',
  description: 'Project-based coding courses and example projects students build at BaseCase Learning.',
};

export default function ProjectsPage() {
  return (
    <div className="bg-white">
      <Showcase />
      <Courses />
    </div>
  );
}
