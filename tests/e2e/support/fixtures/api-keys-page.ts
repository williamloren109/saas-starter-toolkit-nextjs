import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class ApiKeysPage {
  private readonly modalCreateApiKeyButton: Locator;
  private readonly createApiKeyButton: Locator;
  private readonly apiKeyNameInput: Locator;
  private readonly noApiKeysExistsHeader: Locator;
  private readonly revokeApiKeyButton: Locator;
  private readonly revokeApiKeyConfirmationButton: Locator;
  private readonly apiKeyTextBox: Locator;
  private readonly apiKeyDeleteSuccessMessage: string;

  constructor(
    public readonly page: Page,
    public readonly teamSlug: string
  ) {
    this.modalCreateApiKeyButton = this.page
      .getByLabel('Modal')
      .getByRole('button', { name: 'Create API Key' });
    this.createApiKeyButton = this.page.getByRole('button', {
      name: 'Create API Key',
    });
    this.apiKeyNameInput = this.page.getByPlaceholder('My API Key');
    this.noApiKeysExistsHeader = this.page.getByRole('heading', {
      name: "You haven't created any API",
    });
    this.revokeApiKeyButton = this.page.getByRole('button', {
      name: 'Revoke',
    });
    this.revokeApiKeyConfirmationButton = this.page.getByRole('button', {
      name: 'Revoke API Key',
    });
    this.apiKeyTextBox = this.page.getByRole('textbox');
    this.apiKeyDeleteSuccessMessage = 'API key deleted successfully';
  }

  async goto() {
    await this.page.goto(`/teams/${this.teamSlug}/api-keys`);
    await this.page.waitForURL(`/teams/${this.teamSlug}/api-keys`);
    await expect(
      this.page.getByRole('heading', { name: 'API Keys', exact: true })
    ).toBeVisible();
  }

  async createNewApiKey(name: string) {
    await this.fillNewApiKeyName(name);
    await this.modalCreateApiKeyButton.click();
    await expect(this.apiKeyTextBox.inputValue()).toBeTruthy();
  }

  async fillNewApiKeyName(name: string) {
    await this.createApiKeyButton.click();
    await expect(
      this.page.getByRole('heading', { name: 'New API Key' })
    ).toBeVisible();
    await this.apiKeyNameInput.fill(name);
  }

  async apiKeyVisible(name: string) {
    await expect(this.page.locator(`text=${name}`).first()).toBeVisible();
  }

  async revokeApiKey() {
    await this.revokeApiKeyButton.click();
    await expect(
      this.page.getByText(
        'Are you sure you want to revoke this API Key? This action can not be undone.'
      )
    ).toBeVisible();
    await this.revokeApiKeyConfirmationButton.click();
    await expect(
      this.page
        .getByRole('status')
        .and(this.page.getByText(this.apiKeyDeleteSuccessMessage))
    ).toBeVisible();
  }

  async isApiKeyNameLengthErrorVisible() {
    await expect(
      await this.page.getByText('Name should have at most 50 characters')
    ).toBeVisible();
  }

  async isCreateApiKeyButtonDisabled() {
    await expect(this.modalCreateApiKeyButton).toBeDisabled();
  }

  async checkNoApiKeys() {
    await expect(this.noApiKeysExistsHeader).toBeVisible();
  }
}
