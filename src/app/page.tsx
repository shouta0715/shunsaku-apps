import { PasswordGenerator, PasswordGeneratorErrorBoundary } from "@/components/password-generator";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <PasswordGeneratorErrorBoundary>
          <PasswordGenerator />
        </PasswordGeneratorErrorBoundary>
      </main>
    </div>
  );
}
