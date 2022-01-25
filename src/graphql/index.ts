import { gql } from 'apollo-server-express';
import fs from 'fs';
import { join } from 'path';

// collect all files in ./src/graphql folder with .graphql extension
const graphqlFiles = fs.readdirSync(__dirname).filter((dir) => dir.endsWith('.graphql'));

// merge content of files
const accumulatedFilesContent = graphqlFiles.reduce((acc, cur) => {
  const path = join(__dirname, cur);
  const content = fs.readFileSync(path).toString();

  return acc.concat(content);
}, '');

export default gql(accumulatedFilesContent);
