import { SchemaComposer, graphqlVersion } from '../..';

describe('github issue #262: SchemaComposer fails to map enum values in field directives', () => {
  it('check', async () => {
    if (graphqlVersion < 15) {
      return;
    }
    const sc = new SchemaComposer(`
      directive @auth(permissions: [CrudPermissions]) on OBJECT | FIELD_DEFINITION

      """ @model """
      type Note {
        id: ID!
        title: String! @auth(permissions: [CREATE, READ])
      }
      
      enum CrudPermissions {
        CREATE
        READ
        UPDATE
        DELETE
      }
    `);

    expect(sc.getOTC('Note').getFieldDirectiveByName('title', 'auth')).toEqual({
      permissions: ['CREATE', 'READ'],
    });

    const printedSchema = sc.toSDL({
      include: ['Note'],
      exclude: ['String', 'ID', 'Boolean', 'Float', 'Int'],
      omitDescriptions: true,
    });
    if (graphqlVersion >= 17) {
      expect(printedSchema).toContain('directive @oneOf on INPUT_OBJECT');
    }
    expect(printedSchema.replace('\n\ndirective @oneOf on INPUT_OBJECT', ''))
      .toMatchInlineSnapshot(`
      "directive @auth(permissions: [CrudPermissions]) on OBJECT | FIELD_DEFINITION

      directive @specifiedBy(
        url: String!
      ) on SCALAR

      type Note {
        id: ID!
        title: String! @auth(permissions: [CREATE, READ])
      }

      enum CrudPermissions {
        CREATE
        READ
        UPDATE
        DELETE
      }"
    `);
  });

  it('check 2', () => {
    if (graphqlVersion < 15) {
      return;
    }
    const inputSchema = `
    directive @auth(permissions: [CrudPermissions]) on OBJECT | FIELD_DEFINITION

    """ @model """
    type Note {
      id: ID!
      title: String! @auth(permissions: [CREATE, READ])
    }
    
    enum CrudPermissions {
      CREATE
      READ
      UPDATE
      DELETE
    }
  `;

    const composer = new SchemaComposer(inputSchema);
    const processedSchema = composer.buildSchema();
    const printedProcessedSchema = composer.toSDL({
      include: ['Note'],
      exclude: ['String', 'ID', 'Boolean', 'Float', 'Int'],
      omitDescriptions: true,
    });

    const thisWork = new SchemaComposer(processedSchema);
    expect(thisWork).not.toBeUndefined();

    expect(printedProcessedSchema.replace('\n\ndirective @oneOf on INPUT_OBJECT', ''))
      .toMatchInlineSnapshot(`
      "directive @auth(permissions: [CrudPermissions]) on OBJECT | FIELD_DEFINITION

      directive @specifiedBy(
        url: String!
      ) on SCALAR

      type Note {
        id: ID!
        title: String! @auth(permissions: [CREATE, READ])
      }

      enum CrudPermissions {
        CREATE
        READ
        UPDATE
        DELETE
      }"
    `);

    const thisDoesNotWork = new SchemaComposer(printedProcessedSchema);
    expect(thisDoesNotWork).not.toBeUndefined();
  });
});
