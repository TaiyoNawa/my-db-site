// src/utils/__tests__/generateURL.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest';

import { getBaseUrl, generateUrl } from '../generateURL';

// 各テスト後に環境変数・windowをリセット
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('getBaseUrl', () => {
  it('ブラウザ環境ではwindow.location.originを返す', () => {
    // windowが存在する環境をシミュレート
    vi.stubGlobal('window', { location: { origin: 'https://browser.example.com' } });

    expect(getBaseUrl()).toBe('https://browser.example.com');
  });

  it('サーバー環境でNEXT_PUBLIC_SITE_URLが設定されている場合はそれを優先する', () => {
    // windowを未定義にしてサーバー環境をシミュレート
    vi.stubGlobal('window', undefined);
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://haruhate.vercel.app');
    vi.stubEnv('NEXT_PUBLIC_VERCEL_URL', 'some-other-deploy.vercel.app');

    expect(getBaseUrl()).toBe('https://haruhate.vercel.app');
  });

  it('NEXT_PUBLIC_SITE_URLがない場合はNEXT_PUBLIC_VERCEL_URLを使用する', () => {
    vi.stubGlobal('window', undefined);
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_VERCEL_URL', 'haruhate.vercel.app');

    expect(getBaseUrl()).toBe('https://haruhate.vercel.app');
  });

  it('どちらもない場合はlocalhostを返す', () => {
    vi.stubGlobal('window', undefined);
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_VERCEL_URL', '');
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');

    expect(getBaseUrl()).toBe('http://localhost:3000');
  });
});

describe('generateUrl', () => {
  it('スラッシュ始まりのパスを正しく結合する', () => {
    vi.stubGlobal('window', undefined);
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://haruhate.vercel.app');

    expect(generateUrl('/logo/HaruhateTitleLogo.png')).toBe(
      'https://haruhate.vercel.app/logo/HaruhateTitleLogo.png'
    );
  });

  it('スラッシュなしのパスにも正しくセパレータが入る', () => {
    vi.stubGlobal('window', undefined);
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://haruhate.vercel.app');

    expect(generateUrl('logo/HaruhateTitleLogo.png')).toBe(
      'https://haruhate.vercel.app/logo/HaruhateTitleLogo.png'
    );
  });

  it('空文字列のパスではベースURL + "/" を返す', () => {
    vi.stubGlobal('window', undefined);
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://haruhate.vercel.app');

    // path が空文字の場合、セパレータ "/" が付くのが現行の仕様
    expect(generateUrl('')).toBe('https://haruhate.vercel.app/');
  });
});
