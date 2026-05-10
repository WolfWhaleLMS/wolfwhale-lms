-- Switch student companion species to fish-only
-- starter pets. The app only allows clownfish and pufferfish.

ALTER TABLE student_companion_profiles
  DROP CONSTRAINT IF EXISTS student_companion_profiles_species_check;

UPDATE student_companion_profiles
SET
  species = 'clownfish',
  pet_name = CASE WHEN trim(pet_name) = '' THEN 'Bubbles' ELSE pet_name END,
  profile = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(profile, '{species}', to_jsonb('clownfish'::text), true),
        '{petName}',
        to_jsonb(CASE WHEN trim(pet_name) = '' THEN 'Bubbles' ELSE pet_name END),
        true
      ),
      '{unlockedCosmetics}',
      '["starter-reef"]'::jsonb,
      true
    ),
    '{selectedCosmetics}',
    '{"habitat":"starter-reef"}'::jsonb,
    true
  ),
  updated_at = NOW()
WHERE species NOT IN ('clownfish', 'pufferfish');

ALTER TABLE student_companion_profiles
  ADD CONSTRAINT student_companion_profiles_species_check
  CHECK (species IN ('clownfish', 'pufferfish'));
