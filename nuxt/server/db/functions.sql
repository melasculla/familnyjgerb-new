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

CREATE OR REPLACE FUNCTION enforce_lang_group_for_slug()
RETURNS TRIGGER AS $$
BEGIN
   IF EXISTS (SELECT 1 FROM posts WHERE slug = NEW.slug) THEN
      IF (SELECT lang_group FROM posts WHERE slug = NEW.slug LIMIT 1) != NEW.lang_group THEN
            RAISE EXCEPTION 'Slug % already exists in a different langGroup', NEW.slug;
      END IF;
   END IF;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_slug_lang_group
BEFORE INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION enforce_lang_group_for_slug();