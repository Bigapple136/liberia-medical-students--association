import api from './api';

/**
 * Leadership nominations — the "stand for election" flow.
 *
 * The window is owned by the backend (an `election_cycles` row) so the dates
 * are never hardcoded in the frontend again. Every rejection carries the
 * server's own message: "not open yet", "closed on <date>", "already have a
 * pending nomination" are all expected outcomes, not failures.
 */
export const nominationService = {

  /** Current election cycle plus its derived state: open | scheduled | closed | none */
  async getCycle() {
    const response = await api.get('/nominations/cycle');
    return response.data;
  },

  /** Nominate yourself for a position (requires a logged-in member) */
  async nominate({ position_name, level, statement, year_level, phone }) {
    const response = await api.post('/nominations', {
      position_name,
      level,
      statement,
      year_level,
      phone,
    });
    return response.data;
  },

  /** List nominations (admin) */
  async getAll({ status, cycle_id } = {}) {
    const response = await api.get('/nominations', {
      params: { status, cycle_id },
    });
    return response.data.nominations;
  },

  /** Accept or reject a nomination (admin) */
  async updateStatus(id, status, reviewNotes) {
    const response = await api.put(`/nominations/${id}`, {
      status,
      review_notes: reviewNotes || null,
    });
    return response.data.nomination;
  },

  /** Create or update the election cycle (admin) */
  async saveCycle({ academic_year, nomination_opens, nomination_closes, election_date, accepting_nominations }) {
    const response = await api.put('/nominations/cycle', {
      academic_year,
      nomination_opens,
      nomination_closes,
      election_date,
      accepting_nominations,
    });
    return response.data;
  },
};
