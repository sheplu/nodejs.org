'use client';

import { useTranslations } from 'next-intl';
import { useContext, useEffect } from 'react';
import type { FC } from 'react';

import Select from '@/components/Common/Select';
import AIX from '@/components/Icons/Platform/AIX';
import Apple from '@/components/Icons/Platform/Apple';
import Linux from '@/components/Icons/Platform/Linux';
import Microsoft from '@/components/Icons/Platform/Microsoft';
import { useClientContext } from '@/hooks';
import { ReleaseContext } from '@/providers/releaseProvider';
import type { UserOS } from '@/types/userOS';
import {
  formatDropdownItems,
  operatingSystemItems,
} from '@/util/downloadUtils';

type OperatingSystemDropdownProps = { exclude?: Array<UserOS> };

const OperatingSystemDropdown: FC<OperatingSystemDropdownProps> = ({
  exclude = [],
}) => {
  const { os: userOS } = useClientContext();
  const { os, setOS } = useContext(ReleaseContext);
  const t = useTranslations();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setOS(userOS), [userOS]);

  // @TODO: We should have a proper utility that gives
  // disabled OSs, Platforms, based on specific criteria
  // this can be an optimisation for the future
  // to remove this logic from this component
  useEffect(() => {
    const currentOSExcluded = exclude.includes(os);

    const nonExcludedOS = operatingSystemItems
      .map(({ value }) => value)
      .find(os => !exclude.includes(os));

    if (currentOSExcluded && nonExcludedOS) {
      setOS(nonExcludedOS);
    }
    // we shouldn't react when "actions" change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [os, exclude]);

  return (
    <Select
      values={formatDropdownItems({
        items: operatingSystemItems,
        disabledItems: exclude,
        icons: {
          WIN: <Microsoft width={16} height={16} />,
          MAC: <Apple width={16} height={16} />,
          LINUX: <Linux width={16} height={16} />,
          AIX: <AIX width={16} height={16} />,
        },
      })}
      defaultValue={os}
      loading={os === 'LOADING'}
      ariaLabel={t('layouts.download.dropdown.os')}
      onChange={value => setOS(value as UserOS)}
      className="min-w-[8.5rem]"
      inline={true}
    />
  );
};

export default OperatingSystemDropdown;
