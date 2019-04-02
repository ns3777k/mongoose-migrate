import { parse } from 'url';

export function validate(p, ui) {
  return dsn => {
    console.log(dsn);
    try {
      parse(dsn);
    } catch (e) {
      ui.error(e);

    }

    process.exit(1);
  };
}
