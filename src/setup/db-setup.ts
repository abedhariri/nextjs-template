import { dbClient } from '@/lib/dynamodb';
import { CreateTableCommand, CreateTableCommandInput, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import fs from 'fs';
import path from 'path';

// Define the path to the tables folder
const tablesFolderPath = path.join(__dirname, 'tables');

const createTable = async (tableDefinition: CreateTableCommandInput) => {
  try {
    // Check if the table already exists
    const existingTables = await dbClient.send(new ListTablesCommand({}));
    if (existingTables.TableNames?.includes(tableDefinition.TableName!)) {
      console.log(`Table ${tableDefinition.TableName} already exists, skipping creation.`);
      return;
    }

    const data = await dbClient.send(new CreateTableCommand(tableDefinition));
    console.log('Table Created', data);
  } catch (err) {
    console.error('Error creating table', tableDefinition.TableName, err);
  }
};

const createAllTables = async () => {
  try {
    // Read all files in the tables folder
    const files = fs.readdirSync(tablesFolderPath);

    for (const file of files) {
      // Get the full path of the file
      const filePath = path.join(tablesFolderPath, file);

      // Only process TypeScript files
      if (file.endsWith('.ts')) {
        try {
          // Dynamically import the file
          const tableModule = await import(filePath);

          // Check if the module exports a 'table' constant
          if (tableModule.table) {
            await createTable(tableModule.table);
          } else {
            console.warn(`No 'table' export found in ${file}`);
          }
        } catch (importError) {
          console.error(`Failed to import ${file}:`, importError);
        }
      }
    }
  } catch (err) {
    console.error('Error reading tables folder', err);
  }
};

// Start the table creation process
createAllTables();
