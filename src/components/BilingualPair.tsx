type BilingualPairProps = {
  en: string;
  zh: string;
};

export default function BilingualPair({ en, zh }: BilingualPairProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-[#a9762f]/40 bg-[#1c1a17]/70 p-4">
        <span className="mb-2 block text-xs uppercase tracking-wider text-[#b9a988]">
          English
        </span>
        <p className="leading-7 text-[#ece3d2]">{en}</p>
      </div>

      <div className="rounded-lg border border-[#c98f3b]/50 bg-[#3a2b1c]/70 p-4">
        <span className="mb-2 block text-xs uppercase tracking-wider text-[#b9a988]">
          繁體中文
        </span>
        <p className="text-lg leading-8 text-[#fff6df]">{zh}</p>
      </div>
    </div>
  );
}