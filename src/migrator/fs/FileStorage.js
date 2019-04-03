import { writeFileSync } from 'fs';
import { resolve } from 'path';

class FileStorage {
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
    const migrationFileName = `${name}.js`;
    const fullPath = resolve(this.directory, migrationFileName);
    const template = this.template.replace('{{ name }}', migrationFileName);

    writeFileSync(fullPath, template);
  }

  makeName(name) {
    return `${Date.now()}-${name}`;
  }

  locateMigration(name) {
    return resolve(this.directory, `${name}.js`);
  }
}

export default FileStorage;
