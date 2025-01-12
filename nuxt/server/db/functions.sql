CREATE OR REPLACE FUNCTION auto_set_lang_group()
RETURNS TRIGGER AS $$
BEGIN
   IF NEW.lang_group IS NULL THEN
      NEW.lang_group := NEW.id;
   END IF;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_set_lang_group
BEFORE INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION auto_set_lang_group();

CREATE TRIGGER auto_set_lang_group_project
BEFORE INSERT ON projects
FOR EACH ROW
EXECUTE FUNCTION auto_set_lang_group();