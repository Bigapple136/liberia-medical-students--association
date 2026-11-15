import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Spinner from '@components/common/Spinner';
import StatusBadge from '@components/common/StatusBadge';
import { useAuth } from '@context/AuthContext';
import { userService } from '@services/user.service';
import { membershipService } from '@services/membership.service';
import { authService } from '@services/auth.service';
import { CONTACT_EMAIL } from '@utils/constants';

const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name (at least 2 characters).')
    .max(80, 'Name is limited to 80 characters.'),
  phone: z
    .string()
    .trim()
    .max(25, 'Phone number is limited to 25 characters.')
    .refine((value) => value === '' || /^[+\d][\d\s\-().]{5,24}$/.test(value), {
      message: 'Enter a valid phone number (e.g. +231 77 000 0000), or leave it empty.',
    }),
  bio: z.string().max(500, 'Bio is limited to 500 characters.'),
});

const STATUS_EXPLAINERS = {
  active: 'Your membership is current. You have full access to member events, committees, and resources.',
  pending:
    'Your application is being reviewed by the membership committee. We will email you when a decision is made.',
  inactive:
    'Your membership is not currently active. Review the dues structure or contact us to reactivate it.',
  suspended:
    'Your membership is suspended. Contact the executive council to resolve your standing.',
};

function pendingNextSteps(status) {
  if (status !== 'pending') return null;
  return (
    <div className="mt-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
      <p className="font-semibold text-gray-800">What happens next</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5">
        <li>The membership committee reviews your application.</li>
        <li>We email you the decision.</li>
        <li>Once approved, pay your dues to activate full member access.</li>
      </ol>
    </div>
  );
}

function formatMoney(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

function formatPaidDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Dues card (spec §4.4.3) — real data from GET /membership/dues/me.
 * Outstanding = amber (calm), overdue = red (the genuine danger case),
 * settled = brand green. No records is a real state: rows are recorded
 * by the treasurer, so "none yet" is honest, not an error.
 */
function DuesCard() {
  const [dues, setDues] = useState(null); // null = unavailable
  const [loading, setLoading] = useState(true);

  const loadDues = useCallback(async () => {
    setLoading(true);
    try {
      setDues(await membershipService.getMyDues());
    } catch {
      setDues(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDues();
  }, [loadDues]);

  const outstandingCount = dues?.records
    ? dues.records.filter((r) => r.payment_status === 'pending' || r.payment_status === 'overdue').length
    : 0;
  const latestSettled = dues?.records?.find(
    (r) => r.payment_status === 'paid' || r.payment_status === 'waived'
  );

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">Dues</h2>
        <Link
          to="/membership/dues"
          className="inline-flex min-h-[44px] items-center text-sm font-semibold text-lmsa-700 underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
        >
          Payment instructions
        </Link>
      </div>

      {loading ? (
        <div className="mt-3 h-16 animate-pulse rounded-lg bg-gray-100" aria-hidden="true" />
      ) : dues === null ? (
        <p className="mt-3 text-sm text-gray-600">
          We couldn’t load your dues.{' '}
          <button
            type="button"
            onClick={loadDues}
            className="font-semibold text-lmsa-700 underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
          >
            Try again
          </button>
        </p>
      ) : dues.current ? (
        <div
          className={`mt-3 rounded-lg border p-4 ${
            dues.current.payment_status === 'overdue'
              ? 'border-red-200 bg-red-50'
              : 'border-amber-200 bg-amber-50'
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              dues.current.payment_status === 'overdue' ? 'text-red-800' : 'text-amber-900'
            }`}
          >
            {dues.current.payment_status === 'overdue' ? 'Overdue' : 'Pending'}: {dues.current.semester}{' '}
            {dues.current.academic_year} — {formatMoney(dues.current.amount)}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {outstandingCount > 1
              ? `${formatMoney(dues.outstanding_total)} outstanding across ${outstandingCount} semesters. `
              : ''}
            Pay via mobile money, bank transfer, or in person — see payment instructions above.
          </p>
        </div>
      ) : dues.records.length > 0 ? (
        <div className="mt-3 rounded-lg border border-lmsa-200 bg-lmsa-50 p-4">
          <p className="text-sm font-semibold text-lmsa-800">All dues settled</p>
          {latestSettled && (
            <p className="mt-1 text-sm text-gray-600">
              Most recent: {latestSettled.semester} {latestSettled.academic_year} —{' '}
              {formatMoney(latestSettled.amount)}
              {latestSettled.payment_status === 'waived'
                ? ' (waived)'
                : latestSettled.paid_at
                  ? ` · paid ${formatPaidDate(latestSettled.paid_at)}`
                  : ''}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-gray-600 max-w-prose">
          No dues records yet — once the treasurer records your payments, they
          will appear here. Check the payment instructions for this semester&apos;s
          amounts and methods.
        </p>
      )}
    </Card>
  );
}

/**
 * My Profile (spec §4.4).
 *
 * 4.4.1 — Edit form: only fields the backend actually persists
 * (full_name, phone, bio via PUT /users/me); email is the auth identity
 * and stays read-only. Validation is zod with inline field errors near
 * the source; a failed save never clears the form.
 * 4.4.2 — Membership status card: shared StatusBadge + plain-language
 * explainer per status, with the "what happens next" list for pending.
 * 4.4.3 — Dues: live from GET /membership/dues/me, coloured by status
 * (pending amber, overdue red, settled green), with a retry when the fetch
 * fails and an honest "none yet" state. Payment instructions still live on
 * the public dues page, which the card links to.
 * 4.4.4 — Password: changed in-session via supabase.auth.updateUser, so no
 * recovery email is needed and the stored session is replaced in place.
 * Empty, short and mismatched entries are reported on the field itself;
 * the card's alert banner is kept for a request the backend rejects. The
 * plaintext password is never merged into the AuthContext user.
 */
export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const status = user?.membership_status;

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  // Change password form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Re-seed the form if the session user changes (e.g. profile re-fetched
  // after reconnect) — but never while the member is mid-edit with a save
  // in flight.
  useEffect(() => {
    if (saving) return;
    setFullName(user?.full_name || '');
    setPhone(user?.phone || '');
    setBio(user?.bio || '');
  }, [user, saving]);

  const initialSnapshot = useMemo(
    () => JSON.stringify({
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    }),
    [user]
  );

  const isDirty = useMemo(
    () =>
      JSON.stringify({ full_name: fullName, phone, bio }) !== initialSnapshot,
    [fullName, phone, bio, initialSnapshot]
  );

  const handleSave = async (event) => {
    event.preventDefault();
    if (saving) return;

    const parsed = profileSchema.safeParse({ full_name: fullName, phone, bio });
    if (!parsed.success) {
      const errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSaveError(null);
    setSaving(true);

    try {
      const updated = await userService.updateMe({
        full_name: parsed.data.full_name,
        phone: parsed.data.phone,
        bio: parsed.data.bio,
      });
      updateUserProfile(updated || parsed.data);
      toast.success('Profile updated');
    } catch (error) {
      // Inline near the form; the fields keep their values (spec §4.7:
      // failures never clear the form).
      setSaveError(
        error?.response?.data?.message ||
          'Could not save your profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Change password handler
  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (changingPassword) return;

    // Field problems are reported next to the field; the banner is kept for
    // failures that belong to the request as a whole (e.g. a rejected password).
    const nextErrors = {};
    if (!newPassword) nextErrors.new_password = 'Enter a new password.';
    else if (newPassword.length < 8)
      nextErrors.new_password = 'Password must be at least 8 characters.';
    if (!confirmPassword) nextErrors.confirm_password = 'Re-enter your new password.';
    else if (confirmPassword !== newPassword)
      nextErrors.confirm_password = 'Passwords do not match.';

    setPasswordErrors(nextErrors);
    setChangePasswordError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setChangingPassword(true);

    try {
      await authService.changePassword(newPassword);
      // No local session update needed: supabase.auth.updateUser has already
      // replaced the stored session, and this user object is readable by every
      // consumer of AuthContext, so the plaintext password must never be merged
      // into it.
      toast.success('Password updated successfully! You can now log in with your new password.');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordErrors({});
    } catch (error) {
      setChangePasswordError(
        error?.response?.data?.message || 'Could not change password. Please try again.'
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Update your details and review your membership standing.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* 4.4.2 — Membership standing */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-3">Membership status</h2>
          {status ? (
            <div>
              <StatusBadge status={status} />
              <p className="mt-3 text-sm text-gray-600 max-w-prose">
                {STATUS_EXPLAINERS[status] || 'Contact us if your membership status looks wrong.'}
              </p>
              {pendingNextSteps(status)}
              {(status === 'inactive' || status === 'pending') && (
                <Link
                  to="/membership/dues"
                  className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-lmsa-700 underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
                >
                  Review the dues structure
                </Link>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Your membership status is unavailable right now.{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-lmsa-700 underline underline-offset-2 hover:no-underline"
              >
                Contact us
              </a>{' '}
              if this persists.
            </p>
          )}
        </Card>

        {/* 4.4.1 — Edit form */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-1">Profile details</h2>
          <p className="text-sm text-gray-500 mb-4">
            Keep your contact details current — LMSA uses them for event
            updates and membership decisions.
          </p>

          {saveError && (
            <p
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {saveError}
            </p>
          )}

          <form onSubmit={handleSave} noValidate className="space-y-5">
            <Input
              label="Full name"
              name="full_name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={fieldErrors.full_name}
              required
              maxLength={80}
            />

            <Input
              label="Phone number"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={fieldErrors.phone}
              placeholder="+231 77 000 0000"
              helperText="Used for event-day contact. Leave empty if you prefer."
              maxLength={25}
            />

            <div>
              <label
                htmlFor="profile-bio"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Bio <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                id="profile-bio"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                aria-invalid={fieldErrors.bio ? 'true' : 'false'}
                aria-describedby={fieldErrors.bio ? 'profile-bio-error' : undefined}
                className="input"
                placeholder="A line or two about you — clinical interests, committees, goals."
              />
              {fieldErrors.bio ? (
                <p id="profile-bio-error" role="alert" className="mt-1.5 text-sm text-red-600">
                  {fieldErrors.bio}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-400">{bio.length}/500</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" loading={saving} disabled={!isDirty}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
              <span aria-live="polite" className="text-sm text-gray-500">
                {saveError ? '' : saving ? '' : isDirty ? 'Unsaved changes' : 'All changes saved'}
              </span>
            </div>
          </form>
        </Card>

        {/* 4.4.3 — Dues (live from GET /membership/dues/me) */}
        <DuesCard />

        {/* 4.4.4 — Change Password (in-session, client-side via Supabase) */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lmsa-100 text-lmsa-700" aria-hidden="true">
              <Lock size={18} />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Change Password</h2>
              <p className="mt-1 text-sm text-gray-600 max-w-prose">
                Update your password without requesting a recovery link. The change
                takes effect immediately and you&apos;ll be signed out of other sessions.
              </p>
              <p className="mt-2 mb-4 text-sm text-gray-600 max-w-prose">
                Forgotten your current password?{' '}
                <Link
                  to="/forgot-password"
                  className="font-semibold text-lmsa-700 underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-lmsa-600"
                >
                  Reset it via email
                </Link>{' '}
                instead.
              </p>

              {changePasswordError && (
                <p
                  role="alert"
                  className="mt-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {changePasswordError}
                </p>
              )}

              {!changingPassword && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <Input
                    label="New Password"
                    name="new_password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordErrors((prev) => ({ ...prev, new_password: undefined }));
                    }}
                    error={passwordErrors.new_password}
                    placeholder="Min 8 characters"
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    name="confirm_password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordErrors((prev) => ({ ...prev, confirm_password: undefined }));
                    }}
                    error={passwordErrors.confirm_password}
                    placeholder="Re-enter your password"
                    required
                  />

                  <div className="flex items-center gap-3">
                    <Button type="submit" loading={changingPassword}>
                      {changingPassword ? 'Updating…' : 'Change Password'}
                    </Button>
                  </div>
                </form>
              )}

              {changingPassword && (
                <div className="mt-3 text-center">
                  <Spinner size="sm" label="Updating…" className="text-lmsa-700 mb-2" />
                  <p className="text-gray-600">Updating password…</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-3">Account</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-x-3">
              <dt className="text-gray-500 w-28 shrink-0">Email</dt>
              <dd className="font-medium text-gray-900 break-all">{user?.email || '—'}</dd>
            </div>
            <div className="flex flex-wrap gap-x-3">
              <dt className="text-gray-500 w-28 shrink-0">Role</dt>
              <dd className="font-medium text-gray-900 capitalize">{user?.role || 'Member'}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-gray-500">
            Your email is your sign-in identity — contact us to change it.
          </p>
        </Card>
      </div>
    </div>
  );
}
