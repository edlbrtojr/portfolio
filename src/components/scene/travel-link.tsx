"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, Ref } from "react";
import { canTravel, travel } from "./travel";

type Props = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & {
  href: string;
  /** `ir`: da home para o case. `voltar`: do case para a home. */
  direction: "ir" | "voltar";
  /** O projeto cujo braço a câmera segue. */
  slug: string;
  ref?: Ref<HTMLAnchorElement>;
};

/**
 * Link entre a home e a página de um projeto que, em vez de cortar, leva a
 * câmera pelo braço do rio (travel.ts). `onNavigate` só dispara em navegação
 * de cliente: Ctrl/Cmd + clique, botão do meio e "abrir em nova aba"
 * continuam sendo do navegador. Sem cena ou com "reduzir movimento" é um
 * Link comum.
 */
export function TravelLink({ direction, slug, href, ref, ...rest }: Props) {
  const router = useRouter();
  return (
    <Link
      ref={ref}
      href={href}
      {...rest}
      onNavigate={(e) => {
        if (!canTravel()) return;
        e.preventDefault();
        travel(direction, slug, () => router.push(href));
      }}
    />
  );
}
