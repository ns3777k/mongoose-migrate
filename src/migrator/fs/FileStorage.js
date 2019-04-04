import { writeFileSync } from 'fs';
import { resolve } from 'path';

class FileStorage {
  /**
   * @param {String} directory
   */
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

  /**
   * Creates migration file.
   *
   * @param {String} name
   */
  createMigration(name) {
    const migrationFileName = `${name}.js`;
    const fullPath = resolve(this.directory, migrationFileName);
    const contents = this.prepareTemplate([
      ['{{ name }}', migrationFileName]
    ]);

    writeFileSync(fullPath, contents);
  }

  /**
   * Replaces placeholders with provided values.
   *
   * @param {Array<Array<String, String>>} replacePairs
   * @returns {String}
   */
  prepareTemplate(replacePairs = []) {
    let contents = this.template;

    replacePairs.forEach(pair => {
      contents = contents.replace(pair[0], pair[1]);
    });

    return contents;
  }

  /**
   * Normalizes name.
   *
   * @param {String} name
   * @returns {String}
   */
  makeName(name) {
    return `${Date.now()}-${name}`;
  }

  /**
   * Resolves migration path.
   *
   * @param {String} name
   * @returns {String}
   */
  locateMigration(name) {
    return resolve(this.directory, `${name}.js`);
  }
}

export default FileStorage;
