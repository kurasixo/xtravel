import type { Processors, VisaInfoRaw } from '../../types';


export const rusNoVisaProcessors: Processors<VisaInfoRaw> = {
  each: (_, trs, $) => {
    const visaInfoRaw: VisaInfoRaw = {
      countryName: '',
      docs: '',
      daysWithoutVisa: '',
      visaPrice: '',
    };

    $(trs).each((__, tr) => {
      const tds = $(tr).children();

      tds.each((index, td) => {
        const tdText = $(td).text();
        if (index === 0 && tdText !== '') {
          visaInfoRaw.countryName = tdText;
        }

        if (index === 1 && tdText !== '') {
          visaInfoRaw.visaPrice = tdText;
        }

        if (index === 2 && tdText !== '') {
          visaInfoRaw.daysWithoutVisa = tdText;
        }

        if (index === 3 && tdText !== '') {
          visaInfoRaw.docs = tdText;
        }
      });
    });

    return visaInfoRaw;
  },
};
