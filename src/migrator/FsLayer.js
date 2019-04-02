import { writeFileSync } from 'fs';
import { resolve } from 'path';

class FsLayer {
  constructor(directory) {
    this.directory = directory;
    this.template = `// Migration: {{ name }}

async function up(mongoose) {
  // write your migration here
}

async function down(mongoose) {
  // write your migration here
}

module.exports = { up, down };
`;
  }

  createMigration(name) {
    const migrationName = `${Date.now()}-${name}`;
    const migrationFileName = `${migrationName}.js`;

    const fullPath = resolve(this.directory, migrationFileName);
    const template = this.template.replace('{{ name }}', migrationFileName);

    writeFileSync(fullPath, template);

    return migrationName;
  }

  locateMigration(name) {
    return resolve(this.directory, `${name}.js`);
  }
}

export default FsLayer;
