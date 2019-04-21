import { writeFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

class FileStorage {
  /**
   * @param {String} directory
   */
  constructor(directory) {
    this.directory = directory;
    this.template = `// Migration: {{ name }}

/**
 * @param {Mongoose} mongoose
 * @returns {Promise}
 */
export async function up(mongoose) {
  // write your migration here
}

/**
 * @param {Mongoose} mongoose
 * @returns {Promise}
 */
export async function down(mongoose) {
  // write your migration here
}
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
    const contents = this.prepareTemplate([['{{ name }}', migrationFileName]]);

    writeFileSync(fullPath, contents);
  }

  /**
   * Finds all file migrations.
   *
   * @returns {string[]}
   */
  findMigrations() {
    return readdirSync(this.directory, { withFileTypes: true })
      .filter(
        file =>
          !file.isDirectory() &&
          file.name.endsWith('.js') &&
          file.name.match(/^(\d+)\-(.*)/)
      )
      .map(file => file.name.replace('.js', ''))
      .sort((a, b) => {
        const ats = parseInt(a.split('-')[0], 10);
        const bts = parseInt(b.split('-')[0], 10);

        return ats - bts;
      });
  }

  /**
   * Replaces placeholders with provided values.
   *
   * @param {Array<String[]>} replacePairs
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
