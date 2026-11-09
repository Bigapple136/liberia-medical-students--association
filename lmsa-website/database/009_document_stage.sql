-- =====================================================
-- DOCUMENT STAGE TAGGING
-- Depends on: 001_base_schema.sql (documents table exists)
--
-- Every study material is filed under the single `study_material`
-- category, so the public resources page could name three stages of
-- training and then show one flat list that ignored them — a student
-- in their clinical years got the same undifferentiated rows as
-- someone in their first block. This adds an optional `stage` tag,
-- which the resources page filters by and the admin documents page
-- sets per document.
--
-- NULL is meaningful here, not a gap to be filled in: documents
-- uploaded before this migration, and every non-study category, are
-- genuinely untagged. The resources page lists those under their own
-- heading instead of guessing a stage from the title, which would
-- put the wrong material in front of a student who trusted the label.
--
-- Values:
--   'pre_clinical' — pre-clinical years
--   'clinical'     — clinical years
--   'exam'         — exam preparation
--
-- Safe to re-run: the column, the constraint, and the index are each
-- guarded, and existing rows keep working with stage = NULL.
-- =====================================================

ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS stage TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'documents_stage_check'
  ) THEN
    ALTER TABLE documents
      ADD CONSTRAINT documents_stage_check
      CHECK (stage IS NULL OR stage IN ('pre_clinical', 'clinical', 'exam'));
  END IF;
END $$;

COMMENT ON COLUMN documents.stage IS
  'Optional training stage for study materials (pre_clinical, clinical, exam). NULL = untagged.';

-- Partial index: the public library only ever filters by stage, and
-- untagged rows are not worth indexing.
CREATE INDEX IF NOT EXISTS idx_documents_stage
  ON documents (stage)
  WHERE stage IS NOT NULL;
