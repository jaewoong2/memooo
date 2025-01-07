'use client';

import { Slash } from 'lucide-react';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type Props = {
  links: { href?: string; label?: string }[];
};

const CommonBreadCrumb = ({ links }: Props) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {links.map(({ label, href }, index) => (
          <React.Fragment key={label}>
            <BreadcrumbItem>
              <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
            </BreadcrumbItem>
            {index + 1 !== links.length && (
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CommonBreadCrumb;
