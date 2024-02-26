import { useEffect, useState } from 'react';

import { useToast } from '@/ui/use-toast';

import supabase from '@/instance/database';

import { Tables } from '@/type/database-generated.types';

const useUnits = () => {
  const { toastError } = useToast();

  const [units, setUnits] = useState<Tables<'units'>[]>([]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const { data, error } = await supabase.from('units').select();
        if (error) throw error;

        setUnits(data);
      } catch (err) {
        toastError(err);
      }
    };

    fetchUnits().then();
  }, []);

  return units;
};

export default useUnits;
