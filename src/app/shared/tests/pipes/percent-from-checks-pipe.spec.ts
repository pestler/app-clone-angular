import { AvailableReviewCounts } from '../../../core/models/dashboard.models';
import { PercentFromChecksPipe } from '../../pipes/percent-from-checks-pipe';

describe('PercentFromChecksPipe', () => {
  const pipe = new PercentFromChecksPipe();

  it('returns 0 when checksCount is falsy', () => {
    expect(
      pipe.transform({ checksCount: 0, completedChecksCount: 0 } satisfies AvailableReviewCounts),
    ).toBe(0);
    expect(pipe.transform(null)).toBe(0);
    expect(pipe.transform(undefined)).toBe(0);
  });

  it('computes correct percent', () => {
    expect(
      pipe.transform({ checksCount: 4, completedChecksCount: 2 } satisfies AvailableReviewCounts),
    ).toBeCloseTo(50);
    expect(
      pipe.transform({ checksCount: 2, completedChecksCount: 2 } satisfies AvailableReviewCounts),
    ).toBeCloseTo(100);
  });
});
