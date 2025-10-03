import { Pipe, PipeTransform } from '@angular/core';
import { AvailableReviewCounts } from '../../core/models/dashboard.models';

@Pipe({
  name: 'percentFromChecks',
})
export class PercentFromChecksPipe implements PipeTransform {
  transform(item: AvailableReviewCounts | null | undefined): number {
    if (!item || !item.checksCount) return 0;
    return (item.completedChecksCount / item.checksCount) * 100;
  }
}
