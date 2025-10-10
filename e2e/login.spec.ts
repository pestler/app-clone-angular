import { expect, test } from '@playwright/test';

test.describe('Login Page', () => {
  test('should display login elements correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Please login via GitHub')).toBeVisible();
    await expect(
      page.getByText(
        'In order to access the RS School App, you need to login with your GitHub account.',
      ),
    ).toBeVisible();
    const loginButton = page.getByRole('button', { name: /Sign up with GitHub/i });
    await expect(loginButton).toBeVisible();
    await expect(page.getByAltText('RS School Logo')).toBeVisible();
    await expect(page.getByAltText('GitHub Octocat')).toBeVisible();
  });
});
